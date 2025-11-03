const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../util/seed_db");
const Job = require("../models/Job");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("jobs-ejs puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    //await sleeper(5000)
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:8300");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector(
        "a ::-p-text(Click this link to logon)",
      );
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(20000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
      await page.waitForSelector("a ::-p-text(change the secret)");
      await page.waitForSelector('a[href="/secretWord"]');
      const copyr = await page.waitForSelector("p ::-p-text(copyright)");
      const copyrText = await copyr.evaluate((el) => el.textContent);
      console.log("copyright text: ", copyrText);
    });

      //  TEST 1 
  it("should open jobs list and see 20 job entries", async () => {
    const { expect } = await import("chai");
    await page.goto("http://localhost:8300/jobs");
    await page.waitForSelector("table");

    const html = await page.content();
    const rows = html.split("<tr>");
    expect(rows.length).to.equal(21); // 1 header row + 20 job entries

    const jobs = await Job.find({ createdBy: test_user._id });
    expect(jobs.length).to.equal(20);
  });

    // TEST 2 
  it("should open Add A Job form", async () => {
    const { expect } = await import("chai");

    await Promise.all([
      page.click('a[href="/jobs/add"]'),
      page.waitForNavigation(),
    ]);

    const html = await page.content();
    expect(html).to.include("Add a Job");
    await page.waitForSelector('input[name="company"]');
    await page.waitForSelector('input[name="position"]');
  });

    //  TEST 3
  it("should add a new job and verify it appears", async () => {
    const { expect } = await import("chai");

    const companyName = "Puppeteer Co.";
    const positionTitle = "Test Engineer";

    await page.type('input[name="company"]', companyName);
    await page.type('input[name="position"]', positionTitle);

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation(),
    ]);

    const html = await page.content();
    expect(html).to.include("Job added");

    //check that the new job appears in the database
    const latestJob = await Job.findOne({ createdBy: test_user._id }).sort({
      createdAt: -1,
    });
    expect(latestJob.company).to.equal(companyName);
    expect(latestJob.position).to.equal(positionTitle);
  });

  });
});