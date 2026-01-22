import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, Truck, Globe, Clock, AlertTriangle } from "lucide-react";

interface ShippingContent {
  heroTitle: string;
  heroDescription: string;
  productionTime: string;
  usShippingTime: string;
  usTotalTime: string;
  internationalShippingTime: string;
  internationalTotalTime: string;
  customsDisclaimer: string;
  addressDisclaimer: string;
  peakSeasonNote: string;
  supportEmail: string;
}

const DEFAULT_CONTENT: ShippingContent = {
  heroTitle: "Shipping & Delivery",
  heroDescription: "Everything you need to know about how your order gets to you.",
  productionTime: "2–5 business days",
  usShippingTime: "3–5 business days",
  usTotalTime: "5–10 business days",
  internationalShippingTime: "5–20 business days",
  internationalTotalTime: "7–25 business days",
  customsDisclaimer: "Customs fees, duties, and import taxes are NOT included in the product price or shipping cost and are the sole responsibility of the customer.",
  addressDisclaimer: "Please double-check your shipping address before completing your order. We are not responsible for orders shipped to incorrect addresses provided by the customer.",
  peakSeasonNote: "During holidays and peak seasons (Black Friday, Christmas, etc.), production and shipping may take longer than usual. We recommend ordering early for time-sensitive occasions.",
  supportEmail: "support@redeemedwearclothing.com",
};

const STORAGE_KEY = 'admin_shipping_content';

export const ShippingEditor = () => {
  const [content, setContent] = useState<ShippingContent>(DEFAULT_CONTENT);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved shipping content:', e);
      }
    }
  }, []);

  const handleChange = (key: keyof ShippingContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setHasChanges(false);
      toast({ title: 'Shipping content saved!', description: 'Changes will appear on the Shipping page.' });
    } catch (e) {
      toast({ title: 'Failed to save', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const handleReset = () => {
    setContent(DEFAULT_CONTENT);
    localStorage.removeItem(STORAGE_KEY);
    setHasChanges(false);
    toast({ title: 'Reset to defaults', description: 'All shipping content has been reset.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Shipping Content</h2>
          <p className="text-muted-foreground text-sm">Edit the content displayed on the Shipping page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['hero', 'production', 'shipping', 'disclaimers']} className="space-y-4">
        {/* Hero Section */}
        <AccordionItem value="hero" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Page Header
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={content.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="Shipping & Delivery"
              />
            </div>
            <div className="space-y-2">
              <Label>Page Description</Label>
              <Textarea
                value={content.heroDescription}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                placeholder="Description shown below the title"
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Production Times */}
        <AccordionItem value="production" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Production Time
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Production Time</Label>
              <Input
                value={content.productionTime}
                onChange={(e) => handleChange('productionTime', e.target.value)}
                placeholder="2–5 business days"
              />
              <p className="text-xs text-muted-foreground">How long it takes to make each product</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping Times */}
        <AccordionItem value="shipping" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Shipping Times
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">United States</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shipping Time</Label>
                  <Input
                    value={content.usShippingTime}
                    onChange={(e) => handleChange('usShippingTime', e.target.value)}
                    placeholder="3–5 business days"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Delivery Time</Label>
                  <Input
                    value={content.usTotalTime}
                    onChange={(e) => handleChange('usTotalTime', e.target.value)}
                    placeholder="5–10 business days"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">International</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shipping Time</Label>
                  <Input
                    value={content.internationalShippingTime}
                    onChange={(e) => handleChange('internationalShippingTime', e.target.value)}
                    placeholder="5–20 business days"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Delivery Time</Label>
                  <Input
                    value={content.internationalTotalTime}
                    onChange={(e) => handleChange('internationalTotalTime', e.target.value)}
                    placeholder="7–25 business days"
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Disclaimers */}
        <AccordionItem value="disclaimers" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Disclaimers & Notes
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Customs Disclaimer</Label>
              <Textarea
                value={content.customsDisclaimer}
                onChange={(e) => handleChange('customsDisclaimer', e.target.value)}
                placeholder="Information about customs fees..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Address Disclaimer</Label>
              <Textarea
                value={content.addressDisclaimer}
                onChange={(e) => handleChange('addressDisclaimer', e.target.value)}
                placeholder="Information about address accuracy..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Peak Season Note</Label>
              <Textarea
                value={content.peakSeasonNote}
                onChange={(e) => handleChange('peakSeasonNote', e.target.value)}
                placeholder="Note about holiday delays..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                value={content.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="support@example.com"
                type="email"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-background border shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">You have unsaved changes</span>
          <Button onClick={handleSave} size="sm">Save Changes</Button>
        </div>
      )}
    </div>
  );
};

// Export function to get shipping content for the Shipping page
export const getShippingContent = (): ShippingContent => {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_CONTENT;
    }
  }
  return DEFAULT_CONTENT;
};
