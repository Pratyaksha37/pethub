export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I adopt a pet?',
      answer: 'Browse our available pets on the Adopt page, click on a pet you\'re interested in, and submit an application. Our team will review your application and contact you.',
    },
    {
      question: 'What is the adoption fee?',
      answer: 'Adoption fees vary depending on the pet. The fee covers vaccinations, microchipping, and spay/neuter surgery. You can see the specific fee on each pet\'s profile.',
    },
    {
      question: 'Can I visit the pets before adopting?',
      answer: 'Yes! Once your application is approved, we will schedule a meet-and-greet session so you can get to know your potential new family member.',
    },
    {
      question: 'Do you offer pet supplies?',
      answer: 'Yes, check out our Shop page for high-quality pet food, toys, and accessories.',
    },
    {
      question: 'How can I find a vet nearby?',
      answer: 'Use our "Nearby Care" feature to locate top-rated veterinarians, pet stores, and parks in your area.',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Find answers to common questions about adoption, care, and our services.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-3xl p-10 text-center border border-primary/10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <a href="mailto:support@pethub.com" className="text-primary font-bold text-lg hover:underline">
            support@pethub.com
          </a>
        </div>
      </div>
    </div>
  );
}
