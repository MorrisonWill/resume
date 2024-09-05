import { promises as fs } from "fs";
import * as theme from "jsonresume-theme-even";
import puppeteer from "puppeteer";
import { render } from "resumed";

const resume = JSON.parse(await fs.readFile("resume.json", "utf-8"));
const html = await render(resume, theme);

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Set the page content
await page.setContent(html, { waitUntil: "networkidle0" });

// Calculate the height of the content and set the page size accordingly
const height = await page.evaluate(() => {
  return document.documentElement.scrollHeight;
});

// Generate PDF with a custom height to fit all content in one long page
await page.pdf({
  path: "resume.pdf",
  width: "210mm", // A4 width
  height: `${height}px`, // Dynamic height based on content
  printBackground: true,
});

await browser.close();
