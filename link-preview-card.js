/**
 * Copyright 2025 FDangra
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.loadingState = false;
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state" },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        border-radius: var(--ddd-radius-sm);
        padding: var(--ddd-spacing-3);
        max-width: 400px;
        border: var(--ddd-border-sm);
        border-color: var(--themeColor);
      }

      .preview {
        display: flex;
        flex-direction: column;
        text-align: center;
      }

      img {
        max-width: 100%;
        height: auto;
        margin: var(--ddd-spacing-0) auto;
        border-radius: var(--ddd-radius-sm);
        border: var(--ddd-border-md);
      }

      .content {
        margin-top: var(--ddd-spacing-3);
      }
      
      .title {
        font-weight: bold;
        font-size: var(--ddd-font-size-s);
        color: var(--themeColor);
      }

      details {
        border: var(--ddd-border-sm);
        padding: var(--ddd-spacing-2);
        border-radius: var(--ddd-radius-sm);
        height: 70px;
        overflow: auto;
      }

      .desc {
        font-size: var(--ddd-font-size-3xs);
        color: var(--ddd-theme-default-white);
      }

      .url {
        display: inline-block;
        padding: var(--ddd-spacing-2);
        font-weight: bold;
        color: var(--ddd-theme-default-white);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-sm);
        transition: background-color 0.3s;
      }

      .url:hover {
        background-color: var(--themeColor);
      }

      .loading-spinner {
        margin: var(--ddd-spacing-5) auto;
        border: var(--ddd-border-lg);
        border-top: var(--ddd-border-lg);
        border-radius: var(--ddd-radius-xl);
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 600px) {
        :host {
          max-width: 100%;
        }
      }
    `];
  }

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      
      const json = await response.json();
      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }
 
  defaultTheme() {
    if (this.href.includes("psu.edu")) {
      return "var(--ddd-primary-2)";
    } else {
      return `var(--ddd-primary-${Math.floor(Math.random() * 25)})`;
    }
  }

  handleImageError() {
    console.warn("Image failed to load:", this.image);
    this.image = "";
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="preview" style="--themeColor: ${this.themeColor}" part="preview">
        ${this.loadingState
          ? html`<div class="loading-spinner" part="loading-spinner"></div>`
          : html`
            ${this.image ? html`<img src="${this.image}" alt="" @error="${this.handleImageError}" part="image" />` : ''}
            <div class="content" part="content">
              <h3 class="title" part="title">${this.title}</h3>
              <details part="details">
                <summary part="summary">Description</summary>
                <p class="desc" part="desc">${this.description}</p>
              </details>
              <a href="${this.link}" target="_blank" class="url" part="url">Visit Site</a>
            </div>
        `}
      </div>
    `;
  }
}

customElements.define(LinkPreviewCard.tag, LinkPreviewCard);