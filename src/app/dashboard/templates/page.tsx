"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Copy,
  Edit,
  Trash2,
  MessageSquare,
  Smartphone,
  Eye
} from "lucide-react";
import { TemplateDialog } from "@/components/templates/template-dialog";
import { TemplatePreview } from "@/components/templates/template-preview";

// Mock templates data
const mockTemplates = [
  {
    id: "1",
    name: "Welcome Message",
    category: "onboarding",
    type: "sms" as const,
    content: "Welcome to {{company_name}}! We're excited to have you on board. Reply STOP to opt out.",
    variables: ["company_name"],
    description: "Welcome new customers to your service",
    isActive: true,
    usageCount: 156,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Appointment Reminder",
    category: "appointments",
    type: "sms" as const,
    content: "Hi {{name}}, reminder: Your appointment is scheduled for {{date}} at {{time}}. See you soon!",
    variables: ["name", "date", "time"],
    description: "Remind customers of upcoming appointments",
    isActive: true,
    usageCount: 89,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Order Confirmation",
    category: "ecommerce",
    type: "rcs" as const,
    content: "Your order #{{order_number}} has been confirmed! Total: {{amount}}. Track your order: {{tracking_link}}",
    variables: ["order_number", "amount", "tracking_link"],
    description: "Rich order confirmation with tracking",
    isActive: true,
    usageCount: 234,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Promotional Offer",
    category: "marketing",
    type: "sms" as const,
    content: "🎉 Special offer! Get {{discount}}% off your next purchase. Use code: {{promo_code}}. Valid until {{expiry_date}}.",
    variables: ["discount", "promo_code", "expiry_date"],
    description: "Promotional messages with discount codes",
    isActive: false,
    usageCount: 45,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-12"),
  },
];

const categories = ["all", "onboarding", "appointments", "ecommerce", "marketing", "support"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleDuplicateTemplate = (template: any) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates([newTemplate, ...templates]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      onboarding: "bg-blue-100 text-blue-800",
      appointments: "bg-green-100 text-green-800",
      ecommerce: "bg-purple-100 text-purple-800",
      marketing: "bg-orange-100 text-orange-800",
      support: "bg-red-100 text-red-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    return type === "rcs" ? Smartphone : MessageSquare;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable message templates for SMS and RCS.
          </p>
        </div>
        <Button onClick={handleAddTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-sm text-muted-foreground">Total Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.type === "sms").length}
            </div>
            <p className="text-sm text-muted-foreground">SMS Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.type === "rcs").length}
            </div>
            <p className="text-sm text-muted-foreground">RCS Templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const TypeIcon = getTypeIcon(template.type);
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {!template.isActive && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getCategoryColor(template.category)}`}
                    >
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.content}
                    </p>
                  </div>

                  {template.variables.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Variables:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Used {template.usageCount} times
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filters" 
              : "Create your first message template to get started"
            }
          </p>
          <Button onClick={handleAddTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      )}

      <TemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        template={selectedTemplate}
        onSave={(template) => {
          if (selectedTemplate) {
            setTemplates(templates.map(t => t.id === template.id ? template : t));
          } else {
            setTemplates([{ ...template, id: Date.now().toString() }, ...templates]);
          }
          setIsDialogOpen(false);
        }}
      />

      <TemplatePreview
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}