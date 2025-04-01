import { TableDataType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    const userMessage = reqJson.messages[reqJson.messages.length - 1].content;
    const lowerMessage = userMessage.toLowerCase();

    const attachments = reqJson.messages[reqJson.messages.length - 1].experimental_attachments;

    let reply = "This is the assistant's reply";
    let data: TableDataType = [];
    if (lowerMessage.includes("w-2") || lowerMessage.includes("w2")) {
      reply =
        "W-2 forms report your annual wages and the amount of taxes withheld from your paycheck. Ensure your employer provides a W-2 by January 31st.";
      data = [
        { type: "text", signature: "Gross Wages", text: "$75,000" },
        { type: "text", signature: "Federal Tax Withheld", text: "$15,000" },
        { type: "text", signature: "Social Security", text: "$4,650" },
        { type: "text", signature: "Medicare", text: "$1,087.50" },
        { type: "text", signature: "State Tax Withheld", text: "$3,750" },
      ];
    } else if (
      lowerMessage.includes("standard deduction") ||
      lowerMessage.includes("deduction") ||
      lowerMessage.includes("standard") ||
      lowerMessage.includes("deduct")
    ) {
      reply =
        "The standard deduction is a fixed amount that reduces your taxable income. In 2024, it's $13,850 for single filers and $27,700 for married joint filers.";
      data = [
        { type: "text", signature: "Single", text: "$13,850" },
        { type: "text", signature: "Married Joint", text: "$27,700" },
        { type: "text", signature: "Head of Household", text: "$20,800" },
      ];
    } else if (
      lowerMessage.includes("filing status") ||
      lowerMessage.includes("status") ||
      lowerMessage.includes("filing")
    ) {
      reply =
        "Your filing status (Single, Married, Head of Household, etc.) affects your tax rates and deductions. Ensure you choose the correct status based on your situation.";
      data = [
        { type: "text", signature: "Single", text: "No dependents" },
        { type: "text", signature: "Married Joint", text: "Combined income" },
        { type: "text", signature: "Qualifying Widow(er)", text: "2 years limit" },
      ];
    } else if (
      lowerMessage.includes("tax brackets") ||
      lowerMessage.includes("tax rate") ||
      lowerMessage.includes("federal income tax")
    ) {
      reply =
        "The U.S. tax system uses progressive tax brackets. In 2024, the lowest bracket is 10% and the highest is 37%, depending on your taxable income.";
      data = [
        { type: "text", signature: "10% Bracket", text: "$11,600" },
        { type: "text", signature: "12% Bracket", text: "$47,150" },
        { type: "text", signature: "22% Bracket", text: "$100,525" },
      ];
    } else if (
      lowerMessage.includes("child tax credit") ||
      lowerMessage.includes("dependents") ||
      lowerMessage.includes("claim child")
    ) {
      reply =
        "The Child Tax Credit allows eligible parents to claim up to $2,000 per qualifying child under age 17. Some of it may be refundable.";
      data = [
        { type: "text", signature: "Credit per Child", text: "$2,000" },
        { type: "text", signature: "Refundable Portion", text: "$1,600" },
        { type: "text", signature: "Phase-out Start", text: "$200,000 AGI" },
      ];
    } else if (
      lowerMessage.includes("retirement contributions") ||
      lowerMessage.includes("ira") ||
      lowerMessage.includes("401k") ||
      lowerMessage.includes("roth ira")
    ) {
      reply =
        "Contributions to a Traditional IRA or 401(k) may be tax-deductible, reducing taxable income. Roth IRA contributions aren't deductible, but withdrawals are tax-free.";
      data = [
        { type: "text", signature: "Traditional IRA", text: "Tax-deductible" },
        { type: "text", signature: "401(k)", text: "Tax-deductible" },
        { type: "text", signature: "Roth IRA", text: "Tax-free withdrawals" },
      ];
    } else if (
      lowerMessage.includes("capital gains tax") ||
      lowerMessage.includes("stock tax") ||
      lowerMessage.includes("sell investments")
    ) {
      reply =
        "Capital gains tax applies when selling stocks, real estate, or other investments. Short-term gains (held <1 year) are taxed as ordinary income; long-term gains (held >1 year) have lower rates.";
      data = [
        { type: "text", signature: "Short-term Rate", text: "Ordinary Income" },
        { type: "text", signature: "Long-term Rate", text: "0-20%" },
        { type: "text", signature: "Home Sale Exclusion", text: "$250,000" },
      ];
    } else if (
      lowerMessage.includes("state taxes") ||
      lowerMessage.includes("state income tax") ||
      lowerMessage.includes("which states have no income tax")
    ) {
      reply =
        "Some states (like Texas and Florida) have no state income tax, while others have progressive tax rates. Check your state's tax laws for details.";
      data = [
        { type: "text", signature: "No-tax States", text: "TX, FL, NV" },
        { type: "text", signature: "Highest Rate", text: "13.3% (CA)" },
        { type: "text", signature: "Flat Rate Example", text: "5.25% (NC)" },
      ];
    } else if (
      lowerMessage.includes("self-employment tax") ||
      lowerMessage.includes("freelancer tax") ||
      lowerMessage.includes("1099 tax")
    ) {
      reply =
        "Self-employed individuals must pay self-employment tax (Social Security and Medicare) in addition to income tax. Estimated quarterly payments may be required.";
      data = [
        { type: "text", signature: "SE Tax Rate", text: "15.3%" },
        { type: "text", signature: "Deduction", text: "50% of SE Tax" },
        { type: "text", signature: "Minimum Income", text: "$400 net" },
      ];
    } else if (
      lowerMessage.includes("irs audit") ||
      lowerMessage.includes("audit risk") ||
      lowerMessage.includes("audit flag")
    ) {
      reply =
        "The IRS audits fewer than 1% of tax returns, but common triggers include high deductions relative to income, large cash transactions, and self-employment income discrepancies.";
      data = [
        { type: "text", signature: "Audit Rate", text: "<1%" },
        {
          type: "text",
          signature: "Common Triggers",
          text: "High Deductions, Cash Transactions, Self-Employment",
        },
        { type: "text", signature: "Audit Process", text: "2-3 Year Review" },
      ];
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        if (attachments && attachments.length > 0) {
          controller.enqueue(encoder.encode("Analysing attachments...\\n"));
          await new Promise((resolve) => setTimeout(resolve, 2000));
          for (const attachment of attachments) {
            controller.enqueue(encoder.encode(`Processing: ${attachment.name}\\n`));
            await new Promise((resolve) => setTimeout(resolve, 3000));
            controller.enqueue(encoder.encode(`Processed\\n`));
          }
          controller.enqueue(encoder.encode("\\nAnalysis complete. \\n\\n"));
        }

        const replyChunks = reply.match(/.{1,20}/g) || [];
        for (const chunk of replyChunks) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        controller.enqueue(encoder.encode("DATA BEGINS HERE"));
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (data.length > 0) {
          for (const item of data) {
            controller.enqueue(encoder.encode(JSON.stringify(item) + ","));
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
