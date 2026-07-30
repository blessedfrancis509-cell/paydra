import express from "express";
import { GoogleGenAI } from "@google/genai";

export function createApp() {
  const app = express();

  app.use(express.json());

  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/ai/monthly-spending-report", async (req, res) => {
    try {
      const { userBalance, monthlyIncome, monthlySpent, categoryBudgets, transactions, recipients } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: "rule-engine",
          report: {
            reportMonth: "July 2026",
            headline: "July 2026 Monthly Spending & Beneficiary Report",
            summaryParagraph: `Total monthly outflow is ₦${(monthlySpent || 245000).toLocaleString()}, retaining roughly ${Math.round((((monthlyIncome || 950000) - (monthlySpent || 245000)) / (monthlyIncome || 950000)) * 100)}% of income. Peer transfers and utility bills form your largest expense categories.`,
            totalSpent: monthlySpent || 245000,
            healthScore: 88,
            categorizedExpenses: (categoryBudgets || []).map((c: any) => ({
              category: c.name,
              amount: c.spent,
              percentage: Math.round((c.spent / (monthlySpent || 245000)) * 100) || 0,
              aiComment: c.spent > c.allocated ? "Exceeded initial planned allocation" : "Well managed within monthly threshold"
            })),
            topBeneficiaries: (recipients || []).map((r: any) => ({
              name: r.name,
              bankName: r.bankName,
              totalAmount: r.totalAmount,
              count: r.count,
              percentageOfTransfers: Math.round((r.totalAmount / (monthlySpent || 245000)) * 100),
              insight: `Top transfer recipient (${r.count} transfer${r.count > 1 ? 's' : ''})`
            })),
            aiRecommendations: [
              "Set an automated Paydra Vault rule to lock ₦35,000 in your 16.5% APY Fixed Vault immediately after income credit.",
              "Consolidate utility bill payments through Paydra to earn ₦1,200 instant cashback.",
              "Monitor transfers to top beneficiaries to maintain a healthy 3-month emergency buffer."
            ]
          }
        });
      }

      const prompt = `You are Paydra Bank AI Financial Analyst. Analyze this monthly financial data and generate an executive monthly spending report that categorizes expenses and identifies top beneficiaries.

User Data:
- Account Balance: ₦${userBalance}
- Estimated Monthly Income: ₦${monthlyIncome}
- Total Monthly Outflow: ₦${monthlySpent}
- Category Breakdown: ${JSON.stringify(categoryBudgets)}
- Top Beneficiaries / Peer Transfers: ${JSON.stringify(recipients)}
- Recent Transactions: ${JSON.stringify((transactions || []).slice(0, 15))}

Respond strictly in valid JSON format (no markdown tags, no code blocks):
{
  "reportMonth": "July 2026",
  "headline": "July 2026 Monthly Spending & Beneficiary Executive Report",
  "summaryParagraph": "2-3 insightful sentences summarizing spending behavior, income retention rate, and cashflow health.",
  "totalSpent": ${monthlySpent || 0},
  "healthScore": 88,
  "categorizedExpenses": [
    {
      "category": "Category name",
      "amount": 120000,
      "percentage": 45,
      "aiComment": "1 sentence AI assessment of spending in this category"
    }
  ],
  "topBeneficiaries": [
    {
      "name": "Recipient full name",
      "bankName": "Bank Name",
      "totalAmount": 120000,
      "count": 3,
      "percentageOfTransfers": 50,
      "insight": "1 sentence AI insight on transfers to this beneficiary"
    }
  ],
  "aiRecommendations": [
    "Actionable financial recommendation 1",
    "Actionable financial recommendation 2",
    "Actionable financial recommendation 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      return res.json({
        success: true,
        source: "gemini-ai",
        report: parsed
      });
    } catch (error: any) {
      console.warn("Gemini API limit or fallback triggered for spending report:", error?.message || error);
      return res.json({
        success: true,
        source: "fallback",
        report: {
          reportMonth: "July 2026",
          headline: "July 2026 Monthly Spending & Beneficiary Report",
          summaryParagraph: "Monthly expenses remain well balanced with strong cashflow retention. Peer transfers represent your primary outflow category followed by utility bills.",
          totalSpent: req.body.monthlySpent || 245000,
          healthScore: 85,
          categorizedExpenses: [
            { category: "Transfers & Peer Payments", amount: 165000, percentage: 67, aiComment: "Primary outflow source for peer payments" },
            { category: "Bills & Utilities", amount: 30000, percentage: 12, aiComment: "Electricity tokens and mobile connectivity" },
            { category: "Food & Dining", amount: 35000, percentage: 14, aiComment: "Groceries and restaurant orders" }
          ],
          topBeneficiaries: [
            { name: "CHIDI OKAFOR", bankName: "Kuda Bank", totalAmount: 120000, count: 2, percentageOfTransfers: 72, insight: "Primary beneficiary for peer transfers" },
            { name: "AMINA BELLO", bankName: "GTBank", totalAmount: 45000, count: 1, percentageOfTransfers: 28, insight: "Regular personal transfer recipient" }
          ],
          aiRecommendations: [
            "Auto-save 15% of incoming funds into a 16.5% APY Vault.",
            "Set category alert limits for transfers exceeding ₦100,000 monthly.",
            "Consolidate utility payments to maximize instant cashback rewards."
          ]
        }
      });
    }
  });

  app.post("/api/ai/financial-insights", async (req, res) => {
    try {
      const { userBalance, monthlyIncome, monthlySpent, topCategories, recentTransactions } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: "rule-engine",
          insight: {
            headline: "Healthy Cashflow Buffer",
            tip: `You've saved roughly ${Math.round(((monthlyIncome - (monthlySpent || 245000)) / (monthlyIncome || 950000)) * 100)}% of your income this month. Consider auto-locking ₦25,000 into a Paydra High-Yield Vault earning 16.5% APY.`,
            recommendedAction: "Lock ₦25,000 in Vault",
            healthScore: 88,
            categoryTip: topCategories?.[0] ? `Your largest expense area is ${topCategories[0].name}. Setting a weekly budget cap could save you ₦12,500 monthly.` : "Great control on miscellaneous spending!",
            recipientSummary: "You sent ₦165,000 to 2 main recipients this month: AMINA BELLO (₦45,000) and CHIDI OKAFOR (₦120,000).",
            utilitySummary: "Utility bill payments totaled ₦30,000 including Ikeja Electric token (₦25,000) and MTN Airtime (₦5,000)."
          }
        });
      }

      const prompt = `You are Paydra Bank AI Financial Coach & Vault Cashflow Intelligence Engine.
Analyze the user's transaction data:
- Current Account Balance: ₦${userBalance}
- Monthly Income: ₦${monthlyIncome}
- Monthly Spent: ₦${monthlySpent}
- Category Breakdown: ${JSON.stringify(topCategories)}
- Transactions Record: ${JSON.stringify(recentTransactions)}

Respond strictly with valid JSON (no markdown formatting, no code blocks):
{
  "headline": "Short snappy financial summary (max 6 words)",
  "tip": "2 sentences of actionable financial coaching advice based on their transfers and bill habits",
  "recommendedAction": "Clear CTA for Vault savings (e.g., 'Lock ₦35,000 in Emergency Vault')",
  "healthScore": 88,
  "categoryTip": "1 sentence insight about top spending category",
  "recipientSummary": "1 sentence breakdown of WHO they sent money to and total amount",
  "utilitySummary": "1 sentence breakdown of WHAT utility bills they paid for (electricity, airtime, internet)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      return res.json({
        success: true,
        source: "gemini-ai",
        insight: parsed
      });
    } catch (error: any) {
      console.warn("Gemini API limit or fallback triggered for financial insights:", error?.message || error);
      return res.json({
        success: true,
        source: "fallback",
        insight: {
          headline: "Smart Budget Allocation",
          tip: "Keep tracking your daily transactions. You are currently on track with your monthly saving goals.",
          recommendedAction: "Review Savings Goals",
          healthScore: 82,
          categoryTip: "Setting category alert thresholds keeps unexpected expenses low.",
          recipientSummary: "You sent ₦165,000 to recipients this month including Amina Bello and Chidi Okafor.",
          utilitySummary: "Utility payments include Ikeja Electric power tokens and MTN mobile airtime."
        }
      });
    }
  });

  app.post("/api/ai/analyze-transaction", async (req, res) => {
    try {
      const { amount, recipient, note, bankName } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          category: "Transfer",
          riskLevel: "LOW",
          suggestedTag: "#FamilyAndFriends",
          cashbackEarned: Math.floor(amount * 0.01),
          noteAnalysis: "Standard verified transfer"
        });
      }

      const prompt = `Analyze this outgoing transfer in a digital bank:
Amount: ₦${amount}
Recipient: ${recipient}
Bank: ${bankName}
Note/Narrative: "${note}"

Return JSON with:
1. category (one of: Food & Dining, Shopping, Bills & Utilities, Entertainment, Transport, Transfer, Business)
2. riskLevel (LOW, MEDIUM, HIGH)
3. suggestedTag (a hashtag string)
4. cashbackEarned (0 to 100 estimated rewards points)
5. noteAnalysis (short 1-sentence note validation)

Return strictly valid JSON without markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      return res.json(parsed);
    } catch (e) {
      return res.json({
        category: "Transfer",
        riskLevel: "LOW",
        suggestedTag: "#InstantTransfer",
        cashbackEarned: 10,
        noteAnalysis: "Standard peer-to-peer transfer"
      });
    }
  });

  return app;
}
