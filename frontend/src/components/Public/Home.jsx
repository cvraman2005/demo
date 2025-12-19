import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Activity,
  Calendar,
  Users,
  Lock,
  Zap,
  Apple,
  Moon,
  Droplets,
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

function Home() {
  const { isAuthenticated, isPatient, isDoctor } = useAuth();

  const features = [
    { icon: Activity, title: 'Wellness Goals', desc: 'Track daily progress towards personalized health goals set by your provider' },
    { icon: Calendar, title: 'Easy Booking', desc: 'Schedule appointments with healthcare providers at your convenience' },
    { icon: Users, title: 'Provider Tools', desc: 'Manage patient wellness goals and track their progress over time' },
    { icon: Lock, title: 'HIPAA Compliant', desc: 'Your health data is secure and handled according to strict privacy standards' },
  ];

  const healthTips = [
    { icon: Zap, title: 'Exercise', desc: 'Regular physical activity helps maintain a healthy weight, reduces risk of chronic diseases, and improves mental health. Aim for at least 150 minutes of moderate activity per week.' },
    { icon: Apple, title: 'Nutrition', desc: 'A balanced diet rich in fruits, vegetables, whole grains, and lean proteins supports overall health and provides essential nutrients your body needs.' },
    { icon: Moon, title: 'Sleep', desc: 'Quality sleep is crucial for physical and mental health. Adults should aim for 7-9 hours of sleep per night to support immune function and cognitive performance.' },
    { icon: Droplets, title: 'Hydration', desc: 'Staying hydrated helps regulate body temperature, transport nutrients, and maintain organ function. Aim for 8 glasses of water daily, more if exercising.' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Activity className="h-12 w-12 text-[#0066cc]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Healthcare Wellness Portal
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Track your wellness goals, manage appointments, and achieve better health outcomes
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
            </div>
          ) : (
            <Link to={isPatient ? '/patient/dashboard' : '/doctor/dashboard'}>
              <Button size="lg" className="gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-[#0066cc]" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Health & Wellness Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {healthTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-[#0066cc]" />
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{tip.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-[#0066cc] border-2">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-[#0066cc]" />
                <CardTitle>Your Privacy Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 mb-4">
                We are committed to protecting your health information. Our platform is fully HIPAA compliant 
                and employs industry-standard security measures including:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'End-to-end encryption for all data transmission',
                  'Secure authentication and authorization',
                  'Comprehensive audit logging of all access',
                  'Regular security assessments and updates',
                  'Strict access controls and user permissions'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700">
                Your health data is used solely for providing healthcare services and will never be shared 
                without your explicit consent, except as required by law.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;
