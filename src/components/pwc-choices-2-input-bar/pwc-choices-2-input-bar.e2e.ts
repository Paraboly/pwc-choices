import { newE2EPage } from "@stencil/core/testing";

describe("pwc-choices-2", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<pwc-choices-2></pwc-choices-2>");
    const element = await page.find("pwc-choices-2");
    expect(element).toHaveClass("hydrated");
  });

  it("renders changes to the name data", async () => {
    const page = await newE2EPage();

    await page.setContent("<pwc-choices-2></pwc-choices-2>");
    const component = await page.find("pwc-choices-2");
    const element = await page.find("pwc-choices-2 >>> div");
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty("first", "James");
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty("last", "Quincy");
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty("middle", "Earl");
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
