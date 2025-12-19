// Get health information
exports.getHealthInfo = async (req, res) => {
  try {
    const healthInfo = {
      title: 'General Health Information',
      sections: [
        {
          heading: 'Preventive Care',
          content: 'Regular checkups are essential for maintaining good health. Adults should have an annual physical examination and screenings based on age and risk factors.'
        },
        {
          heading: 'Wellness Goals',
          content: 'Setting and tracking wellness goals can help you maintain a healthy lifestyle. Common goals include daily steps, adequate water intake, and sufficient sleep.'
        },
        {
          heading: 'When to See a Doctor',
          content: 'Seek medical attention if you experience persistent symptoms, sudden health changes, or have concerns about your wellbeing.'
        }
      ]
    };
    
    res.json(healthInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get privacy policy
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicy = {
      title: 'Privacy Policy',
      lastUpdated: '2025-12-19',
      sections: [
        {
          heading: 'Data Collection',
          content: 'We collect personal health information necessary to provide healthcare services. This includes your name, contact information, medical history, and wellness data.'
        },
        {
          heading: 'Data Usage',
          content: 'Your data is used solely for providing healthcare services, tracking your wellness progress, and facilitating communication with healthcare providers.'
        },
        {
          heading: 'Data Security',
          content: 'We implement industry-standard security measures including encryption, secure authentication, and audit logging to protect your personal health information.'
        },
        {
          heading: 'Your Rights',
          content: 'You have the right to access, modify, and delete your personal data. You can withdraw consent at any time by contacting us.'
        },
        {
          heading: 'HIPAA Compliance',
          content: 'We are committed to HIPAA compliance. All access to patient data is logged and monitored to ensure privacy and security.'
        }
      ]
    };
    
    res.json(privacyPolicy);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
