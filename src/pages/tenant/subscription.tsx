"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useTheme } from "../../context/ThemeContext";
import { FaCreditCard, FaCheck } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const plans = [
  {
    id: 1,
    name: "FREE",
    description: "5 employees, limited features",
    monthlyPrice: 0.0,
    yearlyPrice: 0.0,
    features: [
      "Up to 5 employees",
      "Basic HR management",
      "Employee profiles",
      "Limited reporting",
      "Email support (48h response)",
    ],
  },
  {
    id: 2,
    name: "BASIC",
    description: "10 employees, email support",
    monthlyPrice: 5.99,
    yearlyPrice: 59.99,
    features: [
      "Up to 10 employees",
      "Advanced HR management",
      "Leave management",
      "Basic reporting",
      "Email support (24h response)",
      "Document management",
    ],
  },
  {
    id: 4,
    name: "PRO",
    description: "50 employees, priority support",
    monthlyPrice: 14.99,
    yearlyPrice: 149.99,
    features: [
      "Up to 50 employees",
      "Complete HR management",
      "Advanced reporting & analytics",
      "Priority support (4h response)",
      "Performance reviews",
      "Custom workflows",
      "API access",
    ],
  },
];




const SubscriptionPage = () => {
  const { colors } = useTheme();
  const router = useRouter(); 
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

useEffect(() => {
  const checkActiveSubscription = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8081/api/v1/tenant/subscriptions/active", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.active) {
          setIsBlocked(true);
          setExpiryDate(data.endsAt);
          alert(`You already have an active subscription until ${data.endsAt}`);
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  

  const loadPermissions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8081/api/v1/tenant/user-role/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const permissions = await res.json();
      localStorage.setItem("permissions", JSON.stringify(permissions));
      window.dispatchEvent(new Event("storage")); 
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  checkActiveSubscription();
  loadPermissions();
}, []);


  const formik = useFormik({
    initialValues: { planId: "" },
    validationSchema: Yup.object({
      planId: Yup.string().required("Please select a plan"),
    }),
    onSubmit: async (values) => {
      if (isBlocked) return alert("You already have an active subscription.");

      setIsSubmitting(true);
      const selectedPlan = plans.find(
        (p) => p.name.toLowerCase() === values.planId.toLowerCase()
      );
      if (!selectedPlan) {
        alert("Invalid plan selected.");
        setIsSubmitting(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8081/api/v1/tenant/subscriptions/payments/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              subscriptionId: selectedPlan.id,
              billingCycle: billingCycle.toUpperCase(),
              currency: "USD",
            }),
          }
        );

        const data = await response.json();

        if (selectedPlan.name === "FREE" && data.message === "SUBSCRIPTION_ACTIVATED") {
          //alert("Subscription activated!");
          toast.success("Subscription activated!");
        } else if (data.approvalUrl) {
          router.push(data.approvalUrl); 
        } else {
          alert("Unexpected response: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Subscription error:", error);
        alert("There was an error processing your subscription.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const getPrice = (plan: (typeof plans)[0]) =>
    billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  const formatPrice = (price: number) => price.toFixed(2);

  const calculateSavings = (monthly: number, yearly: number) => {
    const saved = monthly * 12 - yearly;
    return Math.round((saved / (monthly * 12)) * 100);
  };

  return (
    <div className="p-8 bg-[#F4F6F6] min-h-screen">
      <h1 className="text-2xl font-bold text-[#1C2833] mb-2">Subscription Plans</h1>
      <p className="text-[#2E4053] mb-6">Choose the right plan for your organization</p>

      <div className="mb-8 flex justify-center">
        <div className="bg-white rounded-full p-1 inline-flex shadow-sm">
          {["monthly", "yearly"].map((cycle) => (
            <button
              key={cycle}
              type="button"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === cycle
                  ? "bg-[#2E4053] text-white"
                  : "text-[#2E4053] hover:bg-[#F4F6F6]"
              }`}
              onClick={() => setBillingCycle(cycle as "monthly" | "yearly")}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md p-6 border transition-all ${
                formik.values.planId === plan.name.toLowerCase()
                  ? "border-2 border-[#2E4053] scale-[1.02]"
                  : "border border-gray-200"
              }`}
            >
              <h3 className="text-xl font-bold mb-2 text-[#2E4053]">{plan.name}</h3>
              <p className="text-sm text-[#AAB7B8] mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-[#1C2833] mb-2">
                ${formatPrice(getPrice(plan))} <span className="text-sm font-normal">/{billingCycle}</span>
              </div>

              {billingCycle === "yearly" && plan.name !== "FREE" && (
                <div className="mt-2 text-sm text-green-600">
                  Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                </div>
              )}

              <ul className="text-sm text-[#2E4053] my-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheck className="mr-2 mt-1 text-[#2E4053]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <label className="flex items-center mt-4">
                <input
                  type="radio"
                  name="planId"
                  value={plan.name.toLowerCase()}
                  checked={formik.values.planId === plan.name.toLowerCase()}
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                Select this plan
              </label>
            </div>
          ))}
        </div>

        {formik.errors.planId && (
          <p className="text-red-500 mb-4 text-center">{formik.errors.planId}</p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || !formik.values.planId || isBlocked}
            className={`flex items-center justify-center px-8 py-3 rounded-md text-white font-medium transition-colors ${
              isSubmitting || !formik.values.planId || isBlocked
                ? "bg-[#AAB7B8] cursor-not-allowed"
                : "bg-[#2E4053] hover:bg-[#1C2833]"
            }`}
          >
            <FaCreditCard className="inline mr-2" />
            {isSubmitting ? "Processing..." : "Complete Subscription"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPage;
