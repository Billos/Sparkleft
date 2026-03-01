import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { CategoriesService, CategoryRead } from "../types"
import { getBudgetName } from "../utils/budgetName"

const logger = pino()

export async function categoriesForTransaction(req: Request<{ transactionId: string }>, res: Response) {
  logger.info("=================================== Showing categories for transaction ===================================")
  const { transactionId } = req.params

  // Get all categories
  const { data: allCategories } = await CategoriesService.listCategory(null, 50, 1)

  // Filter out hidden categories
  const billsBudgetName = await getBudgetName(env.billsBudgetId)
  const hiddenCategoriesSet = new Set(env.hiddenCategories)
  const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName && !hiddenCategoriesSet.has(name))

  // Get transaction details for display
  const transactionLink = `${env.fireflyUrl?.replace("/api", "")}/transactions/show/${transactionId}`

  // Build HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Category</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .subtitle a {
            color: #667eea;
            text-decoration: none;
        }
        .subtitle a:hover {
            text-decoration: underline;
        }
        .categories {
            display: grid;
            gap: 12px;
            margin-bottom: 20px;
        }
        .category-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .category-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .category-btn:active {
            transform: translateY(0);
        }
        .no-categories {
            text-align: center;
            color: #999;
            padding: 40px 20px;
        }
        @media (max-width: 480px) {
            .container {
                padding: 30px 20px;
            }
            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Select Category</h1>
        <div class="subtitle">
            Choose a category for this transaction<br>
            <a href="${transactionLink}" target="_blank">View transaction in Firefly III →</a>
        </div>
        <div class="categories">
            ${
              categories.length > 0
                ? categories
                    .map(
                      (category: CategoryRead) => `
                <form method="GET" action="/transaction/${transactionId}/category/${category.id}" style="margin: 0;">
                    <input type="hidden" name="api_token" value="${req.query.api_token || ""}">
                    <button type="submit" class="category-btn">
                        ${category.attributes.name}
                    </button>
                </form>
            `,
                    )
                    .join("")
                : '<div class="no-categories">No categories available</div>'
            }
        </div>
    </div>
</body>
</html>
  `

  res.send(html)
}
