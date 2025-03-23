import { html, fixture, expect } from '@open-wc/testing';
import "../link-preview-card.js";

describe("LinkPreviewCard test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <link-preview-card
        title="title"
      ></link-preview-card>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
