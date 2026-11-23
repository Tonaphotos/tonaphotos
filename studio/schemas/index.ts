import { series } from "./series";
import { about, commercial, featured, portfolio, product, settings, store } from "./singletons";

export const schemaTypes = [series, product, portfolio, featured, commercial, about, store, settings];

export const singletons = ["portfolio", "featured", "commercial", "about", "store", "settings"];
