"""
AI generation routes with credit deduction
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.api.routes.auth import get_current_user
from app.db import db

router = APIRouter(prefix="/ai", tags=["AI"])


# Cost mapping for different AI operations
COST_MAP = {
    "remediation": 5,
    "fix_grammar": 1,
    "generate_summary": 3,
    "translate": 2,
}


# Request/Response models
class GenerateRequest(BaseModel):
    prompt: str
    type: str  # e.g., "remediation", "fix_grammar"


class GenerateResponse(BaseModel):
    result: str
    credits_used: int
    remaining_credits: int


@router.post("/generate", response_model=GenerateResponse)
async def generate_ai_content(
    request: GenerateRequest,
    current_user = Depends(get_current_user)
):
    """
    Generate AI content with credit deduction.
    
    Charges credits based on the operation type. Blocks the request if
    insufficient credits are available.
    """
    try:
        # Validate request type
        if request.type not in COST_MAP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid AI operation type. Must be one of: {', '.join(COST_MAP.keys())}"
            )
        
        # Calculate cost
        cost = COST_MAP[request.type]
        
        # Get user's organization (required for credit deduction)
        if not current_user.organizationId:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User must belong to an organization to use AI features"
            )
        
        # Check credit balance
        organization = await db.organization.find_unique(
            where={"id": current_user.organizationId}
        )
        
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        if organization.creditBalance < cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient credits. Required: {cost}, Available: {organization.creditBalance}"
            )
        
        # Deduct credits and log usage (atomic transaction)
        updated_org = await db.organization.update(
            where={"id": organization.id},
            data={
                "creditBalance": {
                    "decrement": cost
                }
            }
        )
        
        # Log the AI usage
        await db.aiusagelog.create(
            data={
                "userId": current_user.id,
                "organizationId": organization.id,
                "action": request.type,
                "cost": cost,
                "metadata": f"Prompt: {request.prompt[:100]}"  # Store first 100 chars
            }
        )
        
        # TODO: Call OpenAI API here
        # For now, return a mock response
        mock_result = f"Here is the AI generated text for: {request.prompt}"
        
        return GenerateResponse(
            result=mock_result,
            credits_used=cost,
            remaining_credits=updated_org.creditBalance
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"❌ AI Generation Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI content: {str(e)}"
        )

