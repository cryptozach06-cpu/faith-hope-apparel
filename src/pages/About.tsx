import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Target, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Faith-Centered",
      description: "Every design is rooted in Scripture and created to glorify God"
    },
    {
      icon: Target,
      title: "Quality Crafted",
      description: "Premium materials and attention to detail in every piece"
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Supporting ministries and missions with every purchase"
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Faith & Hope Apparel is more than a clothing brand—it's a movement. We believe that what
            you wear can be a powerful testimony to the hope and love found in Christ.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Founded with a passion to share the Gospel through fashion, Faith & Hope Apparel was born
              from a simple idea: clothing can be more than fabric—it can be a conversation starter,
              a declaration of faith, and a daily reminder of God's promises.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each design is carefully crafted with scripture-inspired messages, modern aesthetics, and
              quality that reflects excellence. We partner with global ministries, youth organizations,
              and missions to spread hope to every corner of the world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&h=600&fit=crop"
              alt="Faith & Hope team"
              className="rounded-2xl shadow-xl w-full"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">Principles that guide everything we do</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                  <value.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-primary-foreground rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            To glorify God through meaningful, scripture-inspired apparel that empowers believers
            to share their faith boldly. Every purchase supports global missions, youth ministries,
            and community outreach programs that spread the Gospel to those who need it most.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
