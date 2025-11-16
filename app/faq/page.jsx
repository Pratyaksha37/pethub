export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I adopt a pet?',
      answer: 'Browse our available pets on the Adopt page, click on a pet you\'re interested in, and submit an application. Our team will review your application and contact you.',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{faq.question}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary bg-opacity-10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-4">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <p className="text-primary font-semibold">support@pethub.com</p>
        </div>
      </div>
    </div>
  );
}
