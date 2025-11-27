import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Prayer() {
  const [prayers, setPrayers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (!input.trim()) {
      toast({
        title: "Please enter a prayer",
        variant: "destructive",
      });
      return;
    }

    setPrayers([input, ...prayers]);
    setInput("");
    toast({
      title: "Prayer submitted",
      description: "Your prayer has been added to the wall",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-2">Prayer Wall</h1>
        <p className="text-center text-muted-foreground mb-8">
          Share your prayer requests with our community
        </p>

        <Card className="p-6 mb-8 max-w-2xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prayer request..."
            className="min-h-32 mb-4"
          />
          <Button onClick={handlePost} className="w-full">
            Post Prayer
          </Button>
        </Card>

        <div className="max-w-2xl mx-auto space-y-4">
          {prayers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No prayers yet. Be the first to share!
            </p>
          ) : (
            prayers.map((prayer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 bg-muted/50">
                  <p className="text-foreground">{prayer}</p>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
