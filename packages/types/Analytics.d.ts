type PageName = string;

export type EventName =
  | `Page View ${PageName}`
  | "Sign Up"
  | "Log In"
  | "Log Out"
  | "Trial Started"
  | "Delete Account"
  | "Cancel Subscription"
  | "Subscribed To Email List"
  | "Added Payment Method"
  | "Upgraded To Paid Plan"
  | "Changed Plan"
  | "Free Trial: Next Page Button Funnel To Paid Plan"
  | "Free Trial: Apply Filters Funnel To Paid Plan"
  | "General Settings: Save"
  | "Products: Page Forward"
  | "Products: Page Backward"
  | "Products: Apply Filters"
  | "Products: View Amazon Page"
  | "Products: View Retailer Page"
  | "Products: View Gating Page"
  | "Products: Copy Share Link";

export type Category = "User";
