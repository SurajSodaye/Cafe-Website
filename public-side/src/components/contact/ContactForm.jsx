import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { sendMessage } from '../../services/messageService';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [botField, setBotField] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone.trim()) {
      const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
      if (phoneClean.length < 8 || phoneClean.length > 15) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please write your message or question.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    if (!validate()) return;

    // 1. Honeypot check: silently simulate success for automated bots
    if (botField.trim() !== '') {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
      return;
    }

    // 2. Client-side cooldown check (30s)
    const cooldownKey = 'brew_bloom_msg_cooldown';
    const cooldownUntil = sessionStorage.getItem(cooldownKey);
    if (cooldownUntil && Date.now() < Number(cooldownUntil)) {
      const remainingSeconds = Math.ceil((Number(cooldownUntil) - Date.now()) / 1000);
      setSubmitError(
        `Please wait ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} before sending another note.`
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Include topic if different from general inquiry
      const finalMessage =
        formData.subject && formData.subject !== 'General Inquiry'
          ? `[Topic: ${formData.subject}]\n\n${formData.message.trim()}`
          : formData.message.trim();

      await sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: finalMessage,
      });

      // Set 30-second cooldown in sessionStorage
      sessionStorage.setItem(cooldownKey, String(Date.now() + 30 * 1000));

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting contact form to Firestore:', err);
      // Keep the entered text and show friendly error
      setSubmitError('Could not send your message. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrors({});
    setSubmitError('');
  };

  if (isSubmitted) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200/80 shadow-warm-sm text-center animate-fade-in"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-espresso-900 mb-2">
          Message Received with Gratitude!
        </h3>
        <p className="text-sm sm:text-base text-espresso-600 max-w-md mx-auto mb-6 leading-relaxed">
          Thank you for reaching out to Brew & Bloom Café. Our team in Koregaon Park will get back to you via email or WhatsApp within a few hours.
        </p>
        <Button
          variant="outlineTerracotta"
          size="sm"
          onClick={handleReset}
          icon={RefreshCw}
        >
          Send Another Note
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-espresso-100 shadow-warm-sm">
      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900 mb-2">
        Send Us a Message
      </h3>
      <p className="text-sm text-espresso-600 mb-6">
        Have questions about table reservations, coffee beans, or private garden gatherings? Drop us a line.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
        {/* Hidden Honeypot Anti-Spam Field */}
        <div aria-hidden="true" style={{ display: 'none' }}>
          <label htmlFor="contact-bot-protection">Do not fill this field</label>
          <input
            id="contact-bot-protection"
            name="bot_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
          />
        </div>

        {/* Global Submit Error Message */}
        {submitError && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-espresso-700 mb-1.5">
            Full Name <span className="text-terracotta-500">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            disabled={isSubmitting}
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="e.g. Priya Sharma"
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 min-h-[48px] ${
              errors.name
                ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500 focus:border-terracotta-500'
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-espresso-700 mb-1.5">
              Email Address <span className="text-terracotta-500">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              disabled={isSubmitting}
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="priya@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 min-h-[48px] ${
                errors.email
                  ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                  : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500 focus:border-terracotta-500'
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-espresso-700 mb-1.5">
              Phone Number <span className="text-espresso-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              disabled={isSubmitting}
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="+91 98765 00000"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 min-h-[48px] ${
                errors.phone
                  ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                  : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500 focus:border-terracotta-500'
              }`}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-espresso-700 mb-1.5">
            Inquiry Topic
          </label>
          <select
            id="contact-subject"
            name="subject"
            disabled={isSubmitting}
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-espresso-200 bg-cream-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 min-h-[48px]"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Table Reservation">Table Reservation (4+ guests)</option>
            <option value="Specialty Beans Order">Specialty Coffee Beans / Equipment</option>
            <option value="Events & Book Swaps">Community Events & Book Club</option>
            <option value="Feedback">Feedback for the Baristas</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-espresso-700 mb-1.5">
            Your Note <span className="text-terracotta-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            disabled={isSubmitting}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Tell us about your visit, inquiry, or coffee preferences..."
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 min-h-[120px] ${
              errors.message
                ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500 focus:border-terracotta-500'
            }`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            icon={isSubmitting ? Loader2 : Send}
            className="w-full justify-center shadow-warm-sm min-h-[48px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Sending your message...
              </span>
            ) : (
              'Send Message'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
