import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");

  const plans = [
    {
      name: "Basic",
      price: { monthly: 0, annually: 0 },
      description: "Free",
      features: [
        "5 free flipbooks",
        "Unlimited pages",
        "No ads",
        "API access",
        "1GB storage",
        "1 account user",
        "Password protection",
      ],
      cta: "Login or register",
      highlighted: false,
    },
    {
      name: "Standard",
      price: { monthly: 4, annually: 49 },
      description: "Best for small teams",
      features: [
        "Unlimited flip books",
        "Unlimited updates",
        "Unlimited pages",
        "No ads",
        "No watermarks",
        "API access",
        "10Gb storage",
        "3 account users",
        "White branding",
        "Password protection",
        "Download offline flipbooks",
        "Basic support",
      ],
      cta: "Subscribe",
      highlighted: false,
    },
    {
      name: "Professional",
      price: { monthly: 8, annually: 99 },
      description: "Most popular choice",
      features: [
        "Everything in the standard plan",
        "20Gb storage",
        "10 account users",
        "Reader statistics",
        "Google analytics integration",
        "Lead generation forms",
        "Custom flipbook url and subdomain",
        "Domains restriction",
        "Basic support",
      ],
      cta: "Subscribe",
      highlighted: true,
      badge: "POPULAR",
    },
    {
      name: "Premium",
      price: { monthly: 17, annually: 203 },
      description: "For large organizations",
      features: [
        "Everything in the professional plan",
        "40Gb storage",
        "20 account users",
        "Digital bookshelf",
        "Custom flipbook url and DNS domain",
        "Advanced password protection",
        "Priority support",
      ],
      cta: "Subscribe",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pricing</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">$ U.S. Dollar</span>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to App
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Billing Toggle */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">Save 4 months</span>
            <div className="flex bg-muted rounded-full p-1">
              <Button
                variant={billingPeriod === "annually" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("annually")}
                className="rounded-full"
              >
                Annually
              </Button>
              <Button
                variant={billingPeriod === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("monthly")}
                className="rounded-full"
              >
                Monthly
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            All prices are in U.S. Dollar. Taxes included (where applicable).
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 right-4 bg-primary">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold">
                  {plan.price[billingPeriod] === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ${plan.price[billingPeriod]}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </>
                  )}
                </CardDescription>
                {billingPeriod === "annually" && plan.price.annually > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Billed Yearly ${plan.price.annually}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  variant={plan.name === "Basic" ? "outline" : "default"}
                  onClick={() => {
                    if (plan.name === "Basic") {
                      navigate("/auth");
                    }
                  }}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
