"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Smartphone, Copy, Send } from "lucide-react";

interface TemplatePreviewProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreview({ template, isOpen, onClose }: TemplatePreviewProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    if (template && isOpen) {
      // Initialize variable values with sample data
      const sampleData: Record<string, string> = {
        name: "John Doe",
        first_name: "John",
        last_name: "Doe",
        phone: "+1234567890",
        email: "john.doe@example.com",
        company: "Acme Corp",
        amount: "$99.99",
        date: "March 15, 2024",
        time: "2:00 PM",
        order_number: "ORD-12345",
        tracking_link: "https://tracking.example.com/12345",
        discount: "20",
        promo_code: "SAVE20",
        expiry_date: "March 31, 2024",
      };

      const initialValues: Record<string, string> = {};
      template.variables?.forEach((variable: string) => {
        initialValues[variable] = sampleData[variable] || `{${variable}}`;
      });
      
      setVariableValues(initialValues);
    }
  }, [template, isOpen]);

  useEffect(() => {
    if (template) {
      let content = template.content || "";
      Object.entries(variableValues).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      });
      setPreviewContent(content);
    }
  }, [template, variableValues]);

  if (!template) return null;

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(previewContent);
      // You could show a toast here
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  const TypeIcon = template.type === "rcs" ? Smartphone : MessageSquare;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <TypeIcon className="h-5 w-5" />
            <DialogTitle>{template.name} Preview</DialogTitle>
            <Badge variant="outline" className="ml-2">
              {template.type?.toUpperCase()}
            </Badge>
          </div>
          <DialogDescription>
            Preview how your message will look with sample or custom data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variable Inputs */}
          {template.variables && template.variables.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Variables</h3>
              <div className="space-y-3">
                {template.variables.map((variable: string) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={variable} className="text-sm font-medium">
                      {variable.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                    <Input
                      id={variable}
                      value={variableValues[variable] || ""}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      placeholder={`Enter ${variable}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Message Preview</h3>
            
            {/* Mobile Preview */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border max-w-sm mx-auto">
                  {/* Phone Header */}
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-t-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        {template.type === "rcs" ? "RCS Message" : "SMS"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-3">
                          <p className="text-sm whitespace-pre-wrap">
                            {previewContent}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 px-3">
                          Just now
                        </div>
                      </div>
                    </div>

                    {/* RCS Features Preview */}
                    {template.type === "rcs" && (
                      <div className="space-y-2 px-2">
                        <div className="text-xs text-muted-foreground">
                          Rich features available:
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-8">
                            Quick Reply 1
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-8">
                            Quick Reply 2
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Character Count */}
            <div className="text-sm text-muted-foreground text-center">
              {previewContent.length} characters
              {template.type === "sms" && previewContent.length > 160 && (
                <span className="text-orange-600 ml-2">
                  (Will be sent as {Math.ceil(previewContent.length / 160)} messages)
                </span>
              )}
            </div>

            {/* Raw Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Raw Content</Label>
              <Card>
                <CardContent className="p-3">
                  <pre className="text-sm whitespace-pre-wrap break-words">
                    {previewContent}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopyContent}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Content
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}