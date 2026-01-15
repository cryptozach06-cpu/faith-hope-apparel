import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) and Priority shipping (1-2 days) are also available. International orders typically take 7-14 business days. Some items are print-on-demand and may take an additional 3-5 business days to produce before shipping.",
        },
        {
          question: "Do you offer free shipping?",
          answer:
            "Yes! We offer free standard shipping on all orders over $75 within the United States. International shipping costs are calculated at checkout based on your location.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive an email with a tracking number. You can use this number to track your package on the carrier's website. You can also log into your account to view order status and tracking information.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to most countries worldwide! International shipping rates are calculated at checkout. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.",
        },
        {
          question: "Can I change or cancel my order?",
          answer:
            "We process orders quickly, so please contact us as soon as possible if you need to make changes. If your order hasn't entered production yet, we can usually accommodate changes or cancellations. Once an item is in production or shipped, we cannot cancel it, but you can return it following our return policy.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for all unworn, unwashed items in their original condition with tags attached. Refunds are processed within 5-7 business days after we receive your return.",
        },
        {
          question: "How do I exchange an item for a different size?",
          answer:
            "Contact our customer service team within 30 days of receiving your order. We'll provide a prepaid return label and ship your new size once we receive the original item. Exchanges are free!",
        },
        {
          question: "What if I receive a defective item?",
          answer:
            "We're sorry if you received a defective item! Please contact us immediately with photos of the defect. We'll replace the item at no cost or provide a full refund, your choice.",
        },
        {
          question: "How long do refunds take to process?",
          answer:
            "Once we receive your return, refunds are typically processed within 5-7 business days. The refund will be credited to your original payment method. Please note that it may take an additional few days for the refund to appear on your statement depending on your bank.",
        },
      ],
    },
    {
      category: "Products",
      questions: [
        {
          question: "What sizes do you offer?",
          answer:
            "We offer sizes from XS to 3XL in most styles. Each product page includes a detailed size guide to help you find your perfect fit. If you're between sizes, we recommend sizing up for a more relaxed fit.",
        },
        {
          question: "How do I care for my RedeemedWearClothing items?",
          answer:
            "For best results, machine wash cold with like colors and tumble dry low. Avoid bleach and ironing directly on prints. Following these care instructions will help your items last longer and maintain their quality.",
        },
        {
          question: "What materials do you use?",
          answer:
            "We use high-quality, comfortable fabrics. Most of our t-shirts are 100% cotton or cotton blends. Our hoodies are typically a cotton-polyester blend for warmth and durability. Specific material information is listed on each product page.",
        },
        {
          question: "Are your products sustainable?",
          answer:
            "We're committed to reducing our environmental impact. Many of our products are made using eco-friendly printing methods. Our print-on-demand model also helps reduce waste by only producing items when ordered.",
        },
      ],
    },
    {
      category: "About Our Brand",
      questions: [
        {
          question: "What is RedeemedWearClothing about?",
          answer:
            "RedeemedWearClothing is a faith-based streetwear brand that creates modern, stylish apparel with meaningful Christian messages. Our mission is to help you wear your faith boldly and start conversations that matter.",
        },
        {
          question: "What makes your brand different?",
          answer:
            "We blend contemporary streetwear aesthetics with faith-based messaging. Our designs are created to be worn proudly, whether you're at church, the gym, or hanging out with friends. We focus on quality, comfort, and designs that resonate with modern believers.",
        },
        {
          question: "Do you donate to charity?",
          answer:
            "Yes! A portion of every purchase goes to supporting local ministries and charitable organizations. We believe in using our platform to make a positive impact in our community and beyond.",
        },
      ],
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and various digital wallets. All transactions are secured and encrypted for your protection.",
        },
        {
          question: "Do I need an account to place an order?",
          answer:
            "No, you can checkout as a guest. However, creating an account allows you to track orders, save your shipping information, and access exclusive member benefits.",
        },
        {
          question: "How do I contact customer support?",
          answer:
            "You can reach us through our Contact page, email us at support@redeemedwearclothing.com, or message us on social media. We typically respond within 24-48 hours during business days.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
          >
            Find answers to common questions about orders, shipping, returns, and more.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-8 border-t"
          >
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
