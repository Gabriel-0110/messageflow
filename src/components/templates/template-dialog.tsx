"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
  onSave: (template: any) => void;
}

const categories = [
  "onboarding",
  "appointments", 
  "ecommerce",
  "marketing",
  "support",
  "notifications"
];

export function TemplateDialog({ isOpen, onClose, template, onSave }: TemplateDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "marketing",
    type: "sms" as "sms" | "rcs",
    content: "",
    description: "",
    isActive: true,
  });
  
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        category: template.category || "marketing",
        type: template.type || "sms",
        content: template.content || "",
        description: template.description || "",
        isActive: template.isActive !== undefined ? template.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        category: "marketing",
        type: "sms",
        content: "",
        description: "",
        isActive: true,
      });
    }
  }, [template, isOpen]);

  useEffect(() => {
    // Extract variables from content using regex
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = Array.from(formData.content.matchAll(variableRegex));
    const variables = matches.map(match => match[1].trim());
    setDetectedVariables([...new Set(variables)]);
  }, [formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData = {
      id: template?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      type: formData.type,
      content: formData.content,
      description: formData.description,
      variables: detectedVariables,
      isActive: formData.isActive,
      usageCount: template?.usageCount || 0,
      createdAt: template?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(templateData);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = 
        formData.content.substring(0, start) +
        `{{${variable}}}` +
        formData.content.substring(end);
      
      setFormData({ ...formData, content: newContent });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4;
        textarea.focus();
      }, 0);
    }
  };

  const commonVariables = [
    "name", "first_name", "last_name", "phone", "email",
    "company", "amount", "date", "time", "order_number",
    "tracking_link", "discount", "promo_code", "expiry_date"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            {template 
              ? "Update the message template below."
              : "Create a reusable message template with dynamic variables."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Welcome Message"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Message Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "sms" | "rcs") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="rcs">RCS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this template"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Type your message here... Use {{variable_name}} for dynamic content"
              rows={6}
              required
            />
            <div className="text-sm text-muted-foreground">
              {formData.content.length}/{formData.type === "sms" ? "160" : "1000"} characters
            </div>
          </div>

          {/* Common Variables */}
          <div className="space-y-2">
            <Label>Quick Insert Variables</Label>
            <div className="flex flex-wrap gap-2">
              {commonVariables.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable)}
                  className="text-xs"
                >
                  {variable}
                </Button>
              ))}
            </div>
          </div>

          {/* Detected Variables */}
          {detectedVariables.length > 0 && (
            <div className="space-y-2">
              <Label>Detected Variables</Label>
              <div className="flex flex-wrap gap-2">
                {detectedVariables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {template ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}