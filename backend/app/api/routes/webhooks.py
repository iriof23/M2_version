"""
Paddle Webhook Handler

Handles incoming webhooks from Paddle for:
- transaction.completed (subscriptions and credit packs)
- subscription.created
- subscription.updated
- subscription.canceled
- subscription.paused
- subscription.resumed
"""
import os
import hmac
import hashlib
import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Request, Header, HTTPException, status
from pydantic import BaseModel

from app.db import db

router = APIRouter()

# Environment variable for webhook secret
PADDLE_WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET", "")

# Price ID to Plan mapping
PRICE_TO_PLAN = {
    "pri_01kb5djzbeyaev2k64nzkayfbx": "PRO",
    "pri_01kb5dphg35030j7e9crrcqxd8": "AGENCY",
}

# Price ID to Credit amount mapping (for one-time purchases)
PRICE_TO_CREDITS = {
    "pri_01kb5dww39pc83mag1x8dtrzyw": 500,   # Starter Pack - $15
    "pri_01kb5e09hfcpdpzxvxmzg3c179": 2000,  # Pro Pack - $50
}

# Plan to monthly credits mapping
PLAN_CREDITS = {
    "FREE": 10,
    "PRO": 500,
    "AGENCY": 2000,
}


def verify_paddle_signature(
    payload: bytes,
    signature: Optional[str],
    secret: str
) -> bool:
    """
    Verify Paddle webhook signature.
    
    Paddle uses ts=timestamp;h1=signature format in the Paddle-Signature header.
    The signature is an HMAC-SHA256 of: timestamp + ":" + payload
    
    For development/sandbox, we can skip verification if no secret is set.
    """
    if not secret:
        print("⚠️ WARN: PADDLE_WEBHOOK_SECRET not set, skipping signature verification")
        return True
    
    if not signature:
        print("❌ ERROR: No Paddle-Signature header provided")
        return False
    
    try:
        # Parse the signature header (format: ts=timestamp;h1=hash)
        parts = dict(part.split("=") for part in signature.split(";"))
        timestamp = parts.get("ts", "")
        expected_hash = parts.get("h1", "")
        
        if not timestamp or not expected_hash:
            print("❌ ERROR: Invalid signature format")
            return False
        
        # Build the signed payload: timestamp:body
        signed_payload = f"{timestamp}:{payload.decode('utf-8')}"
        
        # Calculate HMAC-SHA256
        calculated_hash = hmac.new(
            secret.encode('utf-8'),
            signed_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        is_valid = hmac.compare_digest(calculated_hash, expected_hash)
        
        if not is_valid:
            print(f"❌ ERROR: Signature mismatch")
            print(f"  Expected: {expected_hash}")
            print(f"  Calculated: {calculated_hash}")
        
        return is_valid
        
    except Exception as e:
        print(f"❌ ERROR: Signature verification failed: {e}")
        return False


@router.post("/paddle")
async def handle_paddle_webhook(
    request: Request,
    paddle_signature: Optional[str] = Header(None, alias="Paddle-Signature")
):
    """
    Handle incoming Paddle webhooks.
    
    Events handled:
    - transaction.completed: New subscription or credit pack purchase
    - subscription.created: New subscription created
    - subscription.updated: Subscription plan changed
    - subscription.canceled: Subscription canceled
    - subscription.paused: Subscription paused
    - subscription.resumed: Subscription resumed
    """
    # Get raw body for signature verification
    body = await request.body()
    
    # Verify signature (skip in development if no secret)
    if PADDLE_WEBHOOK_SECRET:
        if not verify_paddle_signature(body, paddle_signature, PADDLE_WEBHOOK_SECRET):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid webhook signature"
            )
    else:
        print("⚠️ WARN: Webhook signature verification skipped (no secret configured)")
    
    # Parse the webhook payload
    try:
        payload = json.loads(body)
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: Failed to parse webhook payload: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )
    
    event_type = payload.get("event_type", "")
    data = payload.get("data", {})
    
    print(f"📨 Received Paddle webhook: {event_type}")
    print(f"📦 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        # Route to appropriate handler based on event type
        if event_type == "transaction.completed":
            await handle_transaction_completed(data)
        
        elif event_type == "subscription.created":
            await handle_subscription_created(data)
        
        elif event_type == "subscription.updated":
            await handle_subscription_updated(data)
        
        elif event_type == "subscription.canceled":
            await handle_subscription_canceled(data)
        
        elif event_type == "subscription.paused":
            await handle_subscription_paused(data)
        
        elif event_type == "subscription.resumed":
            await handle_subscription_resumed(data)
        
        else:
            print(f"⚠️ WARN: Unhandled event type: {event_type}")
        
        return {"status": "success", "event_type": event_type}
    
    except Exception as e:
        print(f"❌ ERROR: Failed to process webhook: {e}")
        import traceback
        traceback.print_exc()
        # Return 200 to prevent Paddle from retrying (we log the error)
        return {"status": "error", "message": str(e)}


async def handle_transaction_completed(data: dict):
    """
    Handle transaction.completed event.
    
    This fires when:
    1. A new subscription is purchased
    2. A one-time credit pack is purchased
    3. A subscription renewal payment succeeds
    """
    print("💳 Processing transaction.completed")
    
    transaction_id = data.get("id")
    customer_id = data.get("customer_id")
    subscription_id = data.get("subscription_id")
    items = data.get("items", [])
    custom_data = data.get("custom_data", {}) or {}
    
    # Extract custom data passed during checkout
    org_id = custom_data.get("orgId") or custom_data.get("organization_id")
    user_id = custom_data.get("userId") or custom_data.get("user_id")
    purchase_type = custom_data.get("type", "subscription")  # "subscription" or "credits"
    
    print(f"  Transaction ID: {transaction_id}")
    print(f"  Customer ID: {customer_id}")
    print(f"  Subscription ID: {subscription_id}")
    print(f"  Custom Data: {custom_data}")
    
    # Process each item in the transaction
    for item in items:
        price = item.get("price", {})
        price_id = price.get("id")
        quantity = item.get("quantity", 1)
        
        print(f"  Processing item: {price_id} x {quantity}")
        
        # Check if this is a credit pack purchase
        if price_id in PRICE_TO_CREDITS:
            credits_to_add = PRICE_TO_CREDITS[price_id] * quantity
            print(f"  💰 Credit pack purchase: {credits_to_add} credits")
            
            # Add credits to organization or user
            if org_id:
                await add_credits_to_organization(org_id, credits_to_add)
            elif user_id:
                await add_credits_to_user(user_id, credits_to_add)
            else:
                # Try to find by customer_id
                await add_credits_by_customer_id(customer_id, credits_to_add)
        
        # Check if this is a subscription purchase
        elif price_id in PRICE_TO_PLAN:
            plan = PRICE_TO_PLAN[price_id]
            print(f"  📋 Subscription purchase: {plan} plan")
            
            # Update organization with subscription details
            if org_id:
                await activate_subscription(
                    org_id=org_id,
                    plan=plan,
                    subscription_id=subscription_id,
                    customer_id=customer_id
                )
            elif user_id:
                # For user-level subscriptions (if supported)
                print(f"  ⚠️ User-level subscription not implemented yet")
            else:
                # Try to find org by customer_id
                await activate_subscription_by_customer_id(
                    customer_id=customer_id,
                    plan=plan,
                    subscription_id=subscription_id
                )


async def handle_subscription_created(data: dict):
    """
    Handle subscription.created event.
    
    This fires when a new subscription is created (before first payment).
    """
    print("🆕 Processing subscription.created")
    
    subscription_id = data.get("id")
    customer_id = data.get("customer_id")
    status = data.get("status")
    custom_data = data.get("custom_data", {}) or {}
    items = data.get("items", [])
    
    org_id = custom_data.get("orgId") or custom_data.get("organization_id")
    
    # Determine plan from items
    plan = "FREE"
    for item in items:
        price_id = item.get("price", {}).get("id")
        if price_id in PRICE_TO_PLAN:
            plan = PRICE_TO_PLAN[price_id]
            break
    
    print(f"  Subscription ID: {subscription_id}")
    print(f"  Customer ID: {customer_id}")
    print(f"  Status: {status}")
    print(f"  Plan: {plan}")
    
    if org_id:
        await db.organization.update(
            where={"id": org_id},
            data={
                "paddleCustomerId": customer_id,
                "subscriptionId": subscription_id,
                "subscriptionStatus": status,
                "plan": plan,
            }
        )
        print(f"  ✅ Updated organization {org_id}")


async def handle_subscription_updated(data: dict):
    """
    Handle subscription.updated event.
    
    This fires when:
    - Plan is upgraded/downgraded
    - Payment method is updated
    - Subscription status changes
    """
    print("🔄 Processing subscription.updated")
    
    subscription_id = data.get("id")
    status = data.get("status")
    items = data.get("items", [])
    
    # Determine new plan from items
    plan = None
    for item in items:
        price_id = item.get("price", {}).get("id")
        if price_id in PRICE_TO_PLAN:
            plan = PRICE_TO_PLAN[price_id]
            break
    
    print(f"  Subscription ID: {subscription_id}")
    print(f"  Status: {status}")
    print(f"  Plan: {plan}")
    
    # Find organization by subscription ID
    org = await db.organization.find_first(
        where={"subscriptionId": subscription_id}
    )
    
    if org:
        update_data = {"subscriptionStatus": status}
        
        if plan:
            update_data["plan"] = plan
            update_data["creditBalance"] = PLAN_CREDITS.get(plan, 10)
        
        await db.organization.update(
            where={"id": org.id},
            data=update_data
        )
        print(f"  ✅ Updated organization {org.id}")
    else:
        print(f"  ⚠️ No organization found for subscription {subscription_id}")


async def handle_subscription_canceled(data: dict):
    """
    Handle subscription.canceled event.
    
    Downgrade organization to FREE plan.
    """
    print("❌ Processing subscription.canceled")
    
    subscription_id = data.get("id")
    
    print(f"  Subscription ID: {subscription_id}")
    
    # Find organization by subscription ID
    org = await db.organization.find_first(
        where={"subscriptionId": subscription_id}
    )
    
    if org:
        await db.organization.update(
            where={"id": org.id},
            data={
                "subscriptionStatus": "canceled",
                "plan": "FREE",
                "creditBalance": PLAN_CREDITS["FREE"],
            }
        )
        print(f"  ✅ Canceled subscription for organization {org.id}")
    else:
        print(f"  ⚠️ No organization found for subscription {subscription_id}")


async def handle_subscription_paused(data: dict):
    """
    Handle subscription.paused event.
    """
    print("⏸️ Processing subscription.paused")
    
    subscription_id = data.get("id")
    
    org = await db.organization.find_first(
        where={"subscriptionId": subscription_id}
    )
    
    if org:
        await db.organization.update(
            where={"id": org.id},
            data={"subscriptionStatus": "paused"}
        )
        print(f"  ✅ Paused subscription for organization {org.id}")


async def handle_subscription_resumed(data: dict):
    """
    Handle subscription.resumed event.
    """
    print("▶️ Processing subscription.resumed")
    
    subscription_id = data.get("id")
    
    org = await db.organization.find_first(
        where={"subscriptionId": subscription_id}
    )
    
    if org:
        await db.organization.update(
            where={"id": org.id},
            data={"subscriptionStatus": "active"}
        )
        print(f"  ✅ Resumed subscription for organization {org.id}")


# ============== Helper Functions ==============

async def add_credits_to_organization(org_id: str, credits: int):
    """Add credits to an organization (atomic increment)."""
    org = await db.organization.find_unique(where={"id": org_id})
    if org:
        await db.organization.update(
            where={"id": org_id},
            data={"creditBalance": org.creditBalance + credits}
        )
        print(f"  ✅ Added {credits} credits to organization {org_id}")
    else:
        print(f"  ❌ Organization {org_id} not found")


async def add_credits_to_user(user_id: str, credits: int):
    """Add credits to a user (atomic increment)."""
    user = await db.user.find_unique(where={"id": user_id})
    if user:
        await db.user.update(
            where={"id": user_id},
            data={"creditBalance": user.creditBalance + credits}
        )
        print(f"  ✅ Added {credits} credits to user {user_id}")
    else:
        print(f"  ❌ User {user_id} not found")


async def add_credits_by_customer_id(customer_id: str, credits: int):
    """Add credits by Paddle customer ID."""
    # Try to find organization first
    org = await db.organization.find_first(
        where={"paddleCustomerId": customer_id}
    )
    if org:
        await db.organization.update(
            where={"id": org.id},
            data={"creditBalance": org.creditBalance + credits}
        )
        print(f"  ✅ Added {credits} credits to organization {org.id} (by customer ID)")
        return
    
    print(f"  ⚠️ No organization found for customer {customer_id}")


async def activate_subscription(
    org_id: str,
    plan: str,
    subscription_id: str,
    customer_id: str
):
    """Activate a subscription for an organization."""
    await db.organization.update(
        where={"id": org_id},
        data={
            "plan": plan,
            "subscriptionStatus": "active",
            "subscriptionId": subscription_id,
            "paddleCustomerId": customer_id,
            "creditBalance": PLAN_CREDITS.get(plan, 10),
        }
    )
    print(f"  ✅ Activated {plan} subscription for organization {org_id}")


async def activate_subscription_by_customer_id(
    customer_id: str,
    plan: str,
    subscription_id: str
):
    """Activate subscription by Paddle customer ID."""
    org = await db.organization.find_first(
        where={"paddleCustomerId": customer_id}
    )
    
    if org:
        await db.organization.update(
            where={"id": org.id},
            data={
                "plan": plan,
                "subscriptionStatus": "active",
                "subscriptionId": subscription_id,
                "creditBalance": PLAN_CREDITS.get(plan, 10),
            }
        )
        print(f"  ✅ Activated {plan} subscription for organization {org.id} (by customer ID)")
    else:
        print(f"  ⚠️ No organization found for customer {customer_id}")

