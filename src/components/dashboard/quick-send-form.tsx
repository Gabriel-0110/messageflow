"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function QuickSendForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    message: "",
    type: "sms" as "sms" | "rcs",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/twilio/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.to,
          body: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent!",
          description: `SMS successfully sent to ${formData.to}`,
        });
        setFormData({ to: "", message: "", type: "sms" });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="to" className="text-sm font-medium">Phone Number</Label>
          <Input
            id="to"
            type="tel"
            placeholder="+1234567890"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Message Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "sms" | "rcs") =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="rcs" disabled>
                RCS (Coming Soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={4}
          required
          className="w-full resize-none"
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span className="hidden sm:inline">Character count</span>
          <span className={formData.message.length > 160 ? "text-orange-600" : ""}>
            {formData.message.length}/160 characters
          </span>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Sending...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}