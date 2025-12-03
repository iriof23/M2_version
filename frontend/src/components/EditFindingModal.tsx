import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Editor } from '@/components/editor/Editor';
import { Trash2, Save, Globe, Plus, X, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define types locally for now, ideally should be shared
export interface ProjectFinding {
    id: string;
    owaspId: string;
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
    cvssScore?: number;
    cvssVector?: string;
    status: 'Open' | 'In Progress' | 'Fixed' | 'Accepted Risk';
    description: string;
    recommendations: string;
    evidence?: string;
    affectedAssets: Array<{ url: string; description: string; instanceCount: number }>;
    screenshots: Array<{ id: string; url: string; caption: string }>;
    references?: string;
    project?: {
        client?: {
            name?: string;
        };
    };
}

interface EditFindingModalProps {
    finding: ProjectFinding | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (finding: ProjectFinding) => void;
    onDelete: () => void;
    isEditable?: boolean; // Whether the title can be edited (true for custom templates)
}

export function EditFindingModal({ finding, isOpen, onClose, onUpdate, onDelete, isEditable = false }: EditFindingModalProps) {
    const [localFinding, setLocalFinding] = useState<ProjectFinding | null>(finding);
    const [isDirty, setIsDirty] = useState(false);
    const [newAssetUrl, setNewAssetUrl] = useState('');
    const [affectedAssetsCount, setAffectedAssetsCount] = useState(0);

    // Generate professional Finding ID
    const generateFindingId = (): string => {
        if (finding?.references) return finding.references;
        let clientPrefix = finding?.project?.client?.name?.slice(0, 3).toUpperCase();
        if (!clientPrefix && finding?.title) {
            clientPrefix = finding.title.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
        }
        if (!clientPrefix) clientPrefix = 'GEN';
        const suffix = finding?.id?.replace(/[^A-Za-z0-9]/g, '').slice(-3).toUpperCase() || '000';
        return `${clientPrefix}-${suffix}`;
    };

    const findingId = generateFindingId();

    useEffect(() => {
        setLocalFinding(finding);
        setIsDirty(false);
        setAffectedAssetsCount(finding?.affectedAssets?.length || 0);
    }, [finding]);

    // Dirty state warning on unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (updates: Partial<ProjectFinding>) => {
        if (!localFinding) return;
        setLocalFinding(prev => prev ? ({ ...prev, ...updates }) : null);
        setIsDirty(true);
    };

    const handleSave = () => {
        if (localFinding) {
            onUpdate({
                ...localFinding,
                evidence: localFinding.evidence
            });
            setIsDirty(false);
        }
    };

    const handleClose = () => {
        if (isDirty) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleAddAsset = () => {
        if (!newAssetUrl.trim() || !localFinding) return;
        handleChange({
            affectedAssets: [...localFinding.affectedAssets, {
                url: newAssetUrl.trim(),
                description: '',
                instanceCount: 1
            }]
        });
        setAffectedAssetsCount(localFinding.affectedAssets.length + 1);
        setNewAssetUrl('');
    };

    const removeAsset = (index: number) => {
        if (!localFinding) return;
        handleChange({
            affectedAssets: localFinding.affectedAssets.filter((_, i) => i !== index)
        });
        setAffectedAssetsCount(localFinding.affectedAssets.length - 1);
    };

    if (!localFinding) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-[90vw] w-full h-[90vh] p-0 gap-0 bg-white border-slate-200 shadow-2xl flex flex-col overflow-hidden [&>button]:hidden sm:rounded-xl">
                
                {/* Header */}
                <div className="h-auto min-h-[72px] border-b border-slate-200 flex items-center justify-between px-6 py-4 shrink-0 bg-white z-10">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                         <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm hidden sm:flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0 gap-1">
                            {/* Title Row */}
                            {isEditable ? (
                                <Input 
                                    value={localFinding.title} 
                                    onChange={(e) => handleChange({ title: e.target.value })}
                                    className="font-semibold text-lg border-none px-0 h-7 focus-visible:ring-0 bg-transparent text-slate-900 placeholder:text-slate-400 shadow-none"
                                />
                            ) : (
                                <h2 className="font-semibold text-lg text-slate-900 truncate">
                                    {localFinding.title}
                                </h2>
                            )}
                            
                            {/* Metadata Row - All inline */}
                            <div className="flex items-center gap-2 text-xs">
                                <span className={cn(
                                    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold',
                                    localFinding.severity === 'Critical' && 'bg-red-100 text-red-700',
                                    localFinding.severity === 'High' && 'bg-orange-100 text-orange-700',
                                    localFinding.severity === 'Medium' && 'bg-amber-100 text-amber-700',
                                    localFinding.severity === 'Low' && 'bg-emerald-100 text-emerald-700',
                                    localFinding.severity === 'Informational' && 'bg-blue-100 text-blue-700'
                                )}>
                                    {localFinding.severity}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="font-mono text-slate-500">{findingId}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">{localFinding.status}</span>
                                {isDirty && (
                                    <>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-amber-600 font-medium flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Unsaved
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {onDelete && isEditable && (
                             <Button variant="ghost" size="sm" onClick={onDelete} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={handleClose} className="text-slate-600 border-slate-200 hover:bg-slate-50">
                            Cancel
                        </Button>
                         <Button size="sm" onClick={handleSave} disabled={!isDirty} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </div>

                {/* Body Layout */}
                 <div className="flex-1 min-h-0 grid grid-cols-12">
                    
                    {/* Sidebar (Metadata) - 25% width with subtle background */}
                    <div className="col-span-12 md:col-span-3 border-r border-slate-200 bg-slate-50/80 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        <div className="p-6 space-y-8">
                            
                            {/* Classification */}
                             <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    Classification
                                </h4>
                                <div className="grid gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Severity</label>
                                        <Select
                                            value={localFinding.severity}
                                            onValueChange={(value) => handleChange({ severity: value as any })}
                                        >
                                            <SelectTrigger className="w-full h-9 bg-white border-slate-200 text-sm shadow-sm focus:ring-emerald-500/20">
                                                <SelectValue placeholder="Select severity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Critical', 'High', 'Medium', 'Low', 'Informational'].map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Status</label>
                                        <Select
                                            value={localFinding.status}
                                            onValueChange={(value) => handleChange({ status: value as any })}
                                        >
                                            <SelectTrigger className="w-full h-9 bg-white border-slate-200 text-sm shadow-sm focus:ring-emerald-500/20">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Open', 'In Progress', 'Fixed', 'Accepted Risk'].map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200/60" />

                             {/* Technical Specs */}
                            <div className="space-y-4">
                                 <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Technical Specs</h4>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">CVSS Vector</label>
                                    <Input
                                        value={localFinding.cvssVector || ''}
                                        onChange={(e) => handleChange({ cvssVector: e.target.value })}
                                        className="h-9 font-mono text-xs bg-white border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                                        placeholder="CVSS:3.1/..."
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-200/60" />

                            {/* Assets */}
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Affected Assets</h4>
                                    <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-2 shadow-sm">
                                        {localFinding.affectedAssets.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newAssetUrl}
                                        onChange={(e) => setNewAssetUrl(e.target.value)}
                                        placeholder="Add URL or IP..."
                                        className="h-8 text-xs bg-white border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddAsset()}
                                    />
                                    <Button size="sm" variant="outline" onClick={handleAddAsset} disabled={!newAssetUrl.trim()} className="h-8 w-8 p-0 shrink-0 bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm">
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                                 <div className="space-y-2">
                                    {localFinding.affectedAssets.map((asset, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md shadow-sm group hover:border-emerald-200 transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Globe className="w-3 h-3 text-slate-400 flex-shrink-0 group-hover:text-emerald-400" />
                                                <span className="truncate text-slate-600 font-mono text-xs group-hover:text-slate-900" title={asset.url}>{asset.url}</span>
                                            </div>
                                            <button onClick={() => removeAsset(idx)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {localFinding.affectedAssets.length === 0 && (
                                        <div className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                                            No assets linked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Editors) - 75% width */}
                    <div className="col-span-12 md:col-span-9 h-full overflow-y-auto bg-white scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        <div className="p-12 max-w-4xl mx-auto space-y-12 pb-32">
                            
                             {/* Description - Seamless Editor */}
                            <section className="group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                                        Description
                                    </h3>
                                </div>
                                <div className="min-h-[100px]">
                                    <Editor
                                        content={localFinding.description}
                                        onChange={(html) => handleChange({ description: html })}
                                        placeholder="Start writing the vulnerability description..."
                                        frameless
                                    />
                                </div>
                            </section>

                             {/* Remediation - Seamless Editor */}
                            <section className="group">
                                <div className="flex items-center justify-between mb-4 border-t border-slate-100 pt-10">
                                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Remediation</h3>
                                </div>
                                <div className="min-h-[100px]">
                                    <Editor
                                        content={localFinding.recommendations}
                                        onChange={(html) => handleChange({ recommendations: html })}
                                        placeholder="Explain how to fix this issue..."
                                        frameless
                                    />
                                </div>
                            </section>

                             {/* Evidence - Boxed Editor (Dropzone) */}
                            <section className="group">
                                <div className="flex items-center justify-between mb-4 border-t border-slate-100 pt-10">
                                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Proof of Concept & Evidence</h3>
                                </div>
                                <div className="min-h-[200px]">
                                    <Editor
                                        content={localFinding.evidence || ''}
                                        onChange={(html) => handleChange({ evidence: html })}
                                        placeholder="Paste screenshots, code blocks, or terminal output here..."
                                        variant="evidence"
                                        className="border-2 border-dashed border-emerald-100 bg-emerald-50/20 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors rounded-xl"
                                    />
                                </div>
                            </section>
                            
                            {/* References - Seamless Editor */}
                            <section className="group">
                                <div className="flex items-center justify-between mb-4 border-t border-slate-100 pt-10">
                                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">References</h3>
                                </div>
                                <div className="min-h-[50px]">
                                    <Editor
                                        content={localFinding.references || ''}
                                        onChange={(html) => handleChange({ references: html })}
                                        placeholder="- https://owasp.org/..."
                                        frameless
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                 </div>
            </DialogContent>
        </Dialog>
    );
}