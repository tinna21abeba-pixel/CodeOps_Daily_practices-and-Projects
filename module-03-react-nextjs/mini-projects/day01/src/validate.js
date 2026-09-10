/**
 * validate.js - Pure Form Validation Module for Addis Eats Checkout
 *
 * Rules:
 * 1. Pure function with no side-effects.
 * 2. Takes the entire form state object and returns an errors object.
 * 3. An empty errors object indicates the form is valid.
 */

/**
 * Pure validation function for Addis Eats checkout form.
 * @param {Object} form - Form state containing name, phone, area, and address.
 * @param {string} form.name - Customer full name.
 * @param {string} form.phone - Customer Ethiopian phone number.
 * @param {string} form.area - Delivery sub-city / area in Addis Ababa.
 * @param {string} form.address - Specific street, house number, or landmark.
 * @returns {Object} errors - Object mapping field names to error message strings.
 */
export function validate(form = {}) {
  const errors = {};

  // Rule 1: Full Name
  // Why: Food couriers need an identifiable person name at delivery handoff.
  const trimmedName = (form.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Full name is required';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Rule 2: Phone Number (Ethiopian format: 09... or +2519... with 9 subsequent digits)
  // Why: Couriers call when arriving at gates or checkpoints in Addis Ababa.
  const trimmedPhone = (form.phone || '').trim();
  const ethiopianPhoneRegex = /^(\+251|0)9\d{8}$/;
  if (!trimmedPhone) {
    errors.phone = 'Phone number is required';
  } else if (!ethiopianPhoneRegex.test(trimmedPhone)) {
    errors.phone = 'Enter a valid Ethiopian phone number (e.g. 0911234567 or +251911234567)';
  }

  // Rule 3: Delivery Area
  // Why: Delivery pricing and route assignment rely on specific sub-cities in Addis Ababa.
  const trimmedArea = (form.area || '').trim();
  const validAreas = ['Bole', 'Kazanchis', 'Summit', 'Piassa', 'Sarbet', 'CMC', 'Megenagna', 'Arat Kilo', 'Gerji'];
  if (!trimmedArea) {
    errors.area = 'Please select a delivery area';
  } else if (!validAreas.includes(trimmedArea)) {
    errors.area = 'Please select a supported delivery area';
  }

  // Rule 4: Delivery Address / Specific Street or Landmark
  // Why: Addis Ababa lacks strict postal zip codes; specific landmarks or house numbers prevent lost orders.
  const trimmedAddress = (form.address || '').trim();
  if (!trimmedAddress) {
    errors.address = 'Specific delivery address is required';
  } else if (trimmedAddress.length < 5) {
    errors.address = 'Address must be at least 5 characters (include street, landmark, or house #)';
  }

  return errors;
}

export default validate;
