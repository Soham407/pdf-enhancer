import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "Free",
    yearlyPrice: null,
    features: [
      "5 free flipbooks",
      "Unlimited pages",
      "No ads",
      "API access",
      "1GB storage",
      "1 account user",
      "Password protection"
    ],
    cta: "Login or register",
    popular: false,
  },
  {
    name: "Standard",
    price: "$4",
    yearlyPrice: "$49",
    features: [
      "Unlimited flip books",
      "Unlimited updates",
      "Unlimited pages",
      "No ads",
      "No watermarks",
      "API access",
      "10GB storage",
      "3 account users",
      "White branding",
      "Password protection",
      "Download offline flipbooks",
      "Basic support"
    ],
    cta: "Subscribe",
    popular: false,
  },
  {
    name: "Professional",
    price: "$8",
    yearlyPrice: "$99",
    features: [
      "Everything in the standard plan",
      "20GB storage",
      "10 account users",
      "Reader statistics",
      "Google analytics integration",
      "Lead generation forms",
      "Custom flipbook url and subdomain",
      "Domains restriction",
      "Basic support"
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Premium",
    price: "$17",
    yearlyPrice: "$203",
    features: [
      "Everything in the professional plan",
      "40GB storage",
      "20 account users",
      "Digital bookshelf",
      "Custom flipbook url and DNS domain",
      "Advanced password protection",
      "Priority support"
    ],
    cta: "Subscribe",
    popular: false,
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const navigate = useNavigate();

  const handleCTA = (planName: string) => {
    if (planName === "Basic") {
      navigate("/auth");
    } else {
      console.log(`Subscribe to ${planName}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-sm text-muted-foreground">Save 4 months</span>
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annually
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            All prices are in U.S. Dollar. Taxes included (where applicable).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>
                  {plan.yearlyPrice && (
                    <span className="text-muted-foreground"> / month</span>
                  )}
                </div>
                {plan.yearlyPrice && billingCycle === "yearly" && (
                  <CardDescription className="text-sm">
                    Billed Yearly {plan.yearlyPrice}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleCTA(plan.name)}
                  variant={plan.name === "Basic" ? "outline" : "default"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
}
