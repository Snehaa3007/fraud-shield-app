import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Search, Check, Ban, AlertTriangle, QrCode, Bell, Settings, LayoutDashboard, History, Settings2, BarChart3, Home, User, LineChart, DollarSign, Calendar, Info, Clock, CheckCircle2, Globe } from 'lucide-react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    history: 'History',
    reports: 'Reports',
    profile: 'Profile',
    merchantDashboard: 'Merchant Dashboard',
    quickVerify: 'Quick Verify Payment',
    enterTransaction: 'Enter Transaction ID or UPI Reference Number',
    verifyPayment: 'Verify Payment',
    verifying: 'Verifying...',
    paymentVerified: 'Payment Verified!',
    idLegitimate: 'This transaction ID is legitimate.',
    fraudDetected: 'FRAUD DETECTED!',
    noRecordFound: 'No payment record found for this transaction ID.',
    demoControls: 'Demo Controls',
    simulateRealPayment: 'Simulate Real Payment',
    testFakeReceipt: 'Test Fake Receipt Detection',
    transactionHistory: 'Transaction History',
    noTransactions: 'No transactions to display.',
    verified: 'VERIFIED',
    fraud: 'FRAUD',
    businessReports: 'Business Reports',
    totalSales: 'Total Sales (Today)',
    fraudAttempts: 'Fraud Attempts (Today)',
    paymentsVerified: 'Payments Verified',
    merchantProfile: 'Merchant Profile',
    businessInfo: 'Business Info',
    contact: 'Contact',
    name: 'Name',
    upiId: 'UPI ID',
    phone: 'Phone',
    email: 'Email',
    noTransactionsDisplayed: 'No transactions to display.',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    history: 'इतिहास',
    reports: 'रिपोर्ट',
    profile: 'प्रोफ़ाइल',
    merchantDashboard: 'व्यापारी डैशबोर्ड',
    quickVerify: 'तुरंत भुगतान सत्यापित करें',
    enterTransaction: 'लेन-देन आईडी या UPI संदर्भ संख्या दर्ज करें',
    verifyPayment: 'भुगतान सत्यापित करें',
    verifying: 'सत्यापित हो रहा है...',
    paymentVerified: 'भुगतान सत्यापित हुआ!',
    idLegitimate: 'यह लेन-देन आईडी वैध है।',
    fraudDetected: 'धोखाधड़ी का पता चला!',
    noRecordFound: 'इस लेन-देन आईडी के लिए कोई भुगतान रिकॉर्ड नहीं मिला।',
    demoControls: 'डेमो नियंत्रण',
    simulateRealPayment: 'वास्तविक भुगतान का अनुकरण करें',
    testFakeReceipt: 'नकली रसीद का पता लगाने का परीक्षण करें',
    transactionHistory: 'लेन-देन का इतिहास',
    noTransactions: 'दिखाने के लिए कोई लेन-देन नहीं है।',
    verified: 'सत्यापित',
    fraud: 'धोखाधड़ी',
    businessReports: 'व्यावसायिक रिपोर्ट',
    totalSales: 'कुल बिक्री (आज)',
    fraudAttempts: 'धोखाधड़ी के प्रयास (आज)',
    paymentsVerified: 'सत्यापित भुगतान',
    merchantProfile: 'व्यापारी प्रोफ़ाइल',
    businessInfo: 'व्यावसायिक जानकारी',
    contact: 'संपर्क',
    name: 'नाम',
    upiId: 'UPI आईडी',
    phone: 'फ़ोन',
    email: 'ईमेल',
    noTransactionsDisplayed: 'दिखाने के लिए कोई लेन-देन नहीं है।',
  },
};

let VERIFIED_TRANSACTION_IDS = [
  'TXN16789012345',
  'TXN21876543210',
  'TXN34567890123',
  'TXN45432109876',
  'TXN59012345678',
];

const initialHistory: any[] = [
  { type: 'transaction', id: 1, amount: 250, time: new Date('2025-08-17T14:30:00Z'), transactionId: 'TXN123456789' },
  { type: 'fraud', id: 2, amount: 500, time: new Date('2025-08-17T14:25:00Z'), transactionId: 'FAKE123456789' },
  { type: 'transaction', id: 3, amount: 150, time: new Date('2025-08-17T14:20:00Z'), transactionId: 'TXN987654321' },
  { type: 'transaction', id: 4, amount: 75, time: new Date('2025-08-17T14:15:00Z'), transactionId: 'TXN543210987' },
  { type: 'fraud', id: 5, amount: 1000, time: new Date('2025-08-17T14:10:00Z'), transactionId: 'FAKE987654321' },
];

const Button = ({ children, variant = 'default', className, onClick, disabled, type = 'button' }: { children: React.ReactNode, variant?: string, className?: string, onClick?: () => void, disabled?: boolean, type?: "button" | "submit" | "reset" }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  if (variant === 'default') baseClasses += ' bg-[#2968B4] text-white hover:bg-blue-600';
  else if (variant === 'destructive') baseClasses += ' bg-red-500 text-white hover:bg-red-600';
  else if (variant === 'outline') baseClasses += ' border border-gray-300 bg-white text-gray-800 hover:bg-gray-100';
  else if (variant === 'ghost') baseClasses += ' hover:bg-gray-100 text-gray-700';

  const sizes = { default: 'h-10 px-4 py-2', icon: 'h-10 w-10' };
  return <button type={type} className={`${baseClasses} ${sizes.default} ${className} transition-all duration-300`} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`rounded-2xl border-2 bg-white shadow-xl ${className}`}>{children}</div>;
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`} {...props} />;
const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: string, className?: string }) => {
  let baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  if (variant === 'success') baseClasses += ' bg-green-100 text-green-700';
  else if (variant === 'destructive') baseClasses += ' bg-red-100 text-red-700';
  else if (variant === 'neutral') baseClasses += ' bg-gray-100 text-gray-700';
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
};

const MessageToast = ({ message, type, onClose }: { message: string, type: string, onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false); onClose(); }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let bgColor, borderColor, icon;
  if (type === 'success') { bgColor = 'bg-green-100'; borderColor = 'border-green-500'; icon = <Check className="h-5 w-5 text-green-700" />; }
  else if (type === 'destructive') { bgColor = 'bg-red-100'; borderColor = 'border-red-500'; icon = <AlertTriangle className="h-5 w-5 text-red-700" />; }
  else { bgColor = 'bg-gray-100'; borderColor = 'border-gray-500'; icon = <Bell className="h-5 w-5 text-gray-700" />; }

  if (!isVisible) return null;
  return <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-80 p-4 rounded-lg border-2 shadow-lg z-50 transition-all duration-300 ease-out animate-slide-in-up ${bgColor} ${borderColor}`}><div className="flex items-center space-x-3">{icon}<p className="text-sm font-medium">{message}</p></div></div>;
};

const DashboardPage = ({ setAppMessage, addToHistory, t }: { setAppMessage: (msg: any) => void, addToHistory: (item: any) => void, t: any }) => {
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  
  const fraudAlertSound = useRef<HTMLAudioElement | null>(null);

  // This useEffect now only runs once to create the audio object.
  useEffect(() => {
    fraudAlertSound.current = new Audio('/fraud-alert.mp3');
  }, []);

  const handleVerify = (idToCheck?: string) => {
    const currentId = idToCheck || transactionId;

    if (!currentId.trim()) {
      setAppMessage({ message: t.enterTransaction, type: 'destructive' });
      return;
    }
    setIsLoading(true);
    setVerificationResult(null);
    setTimeout(() => {
      const isVerified = VERIFIED_TRANSACTION_IDS.includes(currentId);
      setIsLoading(false);
      if (isVerified) {
        setVerificationResult('success');
      } else {
        setVerificationResult('fraud');
        addToHistory({
          type: 'fraud',
          amount: Math.floor(Math.random() * 1000) + 1,
          time: new Date(),
          transactionId: currentId
        });
      }
    }, 1500);
  };

  const handleSimulatePayment = () => {
    const randomId = `TXN${Math.floor(Math.random() * 90000) + 10000}${Date.now()}`;
    VERIFIED_TRANSACTION_IDS.push(randomId);
    addToHistory({
      type: 'transaction',
      amount: Math.floor(Math.random() * 500) + 50,
      time: new Date(),
      transactionId: randomId
    });
    setAppMessage({ message: `${t.idLegitimate} ID: ${randomId} is added.`, type: 'success' });
  };

  // THIS IS THE MAJOR FIX: The "Test Fake Receipt" button now triggers the alert directly.
  const handleSimulateFakeReceipt = () => {
    const fakeId = `FAKE${Math.floor(Math.random() * 90000) + 10000}${Date.now()}`;
    
    // 1. Show the fraud UI immediately
    setVerificationResult('fraud');
    setTransactionId(fakeId); // Update the input bar as well

    // 2. Play the sound (this will work because it's inside a click handler)
    const audio = fraudAlertSound.current;
    if (audio) {
      audio.play().catch(error => console.error("Audio playback failed:", error));
      // Stop the sound after 5 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 5000);
    }

    // 3. Add to history
    addToHistory({
      type: 'fraud',
      amount: Math.floor(Math.random() * 1000) + 1,
      time: new Date(),
      transactionId: fakeId
    });
  };

  return (
    <div className="p-4 pt-8 pb-24">
      <section className="p-4 pt-0">
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Search className="text-[#2968B4] mr-2" />
              {t.quickVerify}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input type="text" placeholder={t.enterTransaction} value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="flex-1" />
                <Button variant="outline"><QrCode className="h-5 w-5" /></Button>
              </div>
              <Button onClick={() => handleVerify()} disabled={isLoading} className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                {isLoading ? t.verifying : t.verifyPayment}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {verificationResult && (
        <section className="p-4">
          {verificationResult === 'success' && (
            <Card className="border-l-4 border-green-500 bg-green-50 shadow-md animate-fade-in">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center pulse-success"><Check className="text-white h-6 w-6" /></div>
                <div><h3 className="font-semibold text-green-800">{t.paymentVerified}</h3><p className="text-sm text-green-700">{t.idLegitimate}</p></div>
              </CardContent>
            </Card>
          )}
          {verificationResult === 'fraud' && (
            <Card className="border-l-4 border-red-500 bg-red-50 shadow-md animate-fade-in">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-shake"><AlertTriangle className="text-white h-6 w-6" /></div>
                <div><h3 className="font-semibold text-red-800">{t.fraudDetected}</h3><p className="text-sm text-red-700">{t.noRecordFound}</p></div>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      <section className="p-4 mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">{t.demoControls}</h3>
            <div className="space-y-2">
              <Button onClick={handleSimulatePayment} className="w-full bg-green-500 hover:bg-green-600">{t.simulateRealPayment}</Button>
              <Button onClick={handleSimulateFakeReceipt} variant="destructive" className="w-full">{t.testFakeReceipt}</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const HistoryPage = ({ recentItems, t }: { recentItems: any[], t: any }) => {
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatTime = (isoString: string) => new Date(isoString).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="p-4 pt-8 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.transactionHistory}</h1>
      <div className="space-y-4">
        {recentItems.length > 0 ? (
          [...recentItems].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map(item => (
            <Card key={item.id} className={`border-l-4 ${item.type === 'transaction' ? 'border-green-500' : 'border-red-500'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'transaction' ? 'bg-green-500' : 'bg-red-500'}`}>{item.type === 'transaction' ? <Check className="h-5 w-5 text-white" /> : <Ban className="h-5 w-5 text-white" />}</div>
                  <div><p className="font-semibold text-gray-800">{formatCurrency(item.amount)}</p><p className="text-xs text-gray-500">{formatTime(item.time)}</p></div>
                </div>
                <div><Badge variant={item.type === 'transaction' ? 'success' : 'destructive'}>{item.type === 'transaction' ? t.verified : t.fraud}</Badge><p className="text-xs text-gray-400 mt-1">{item.transactionId}</p></div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500"><Info className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>{t.noTransactionsDisplayed}</p></div>
        )}
      </div>
    </div>
  );
};

const ReportsPage = ({ t }: { t: any }) => (
  <div className="p-4 pt-8 pb-24 text-center">
    <LineChart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
    <h1 className="text-2xl font-bold text-gray-800">{t.businessReports}</h1>
    <p className="text-gray-600 mt-2">Visualize your performance and fraud trends.</p>
    <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
      <Card className="bg-blue-50"><CardContent className="p-4 flex items-center space-x-3"><div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-2xl text-blue-500">₹</div><div><p className="text-sm text-gray-600">{t.totalSales}</p><p className="font-bold text-lg text-gray-800">₹1,500.00</p></div></CardContent></Card>
      <Card className="bg-red-50"><CardContent className="p-4 flex items-center space-x-3"><AlertTriangle className="w-8 h-8 text-red-500" /><div><p className="text-sm text-gray-600">{t.fraudAttempts}</p><p className="font-bold text-lg text-gray-800">2</p></div></CardContent></Card>
      <Card className="bg-green-50"><CardContent className="p-4 flex items-center space-x-3"><CheckCircle2 className="w-8 h-8 text-green-500" /><div><p className="text-sm text-gray-600">{t.paymentsVerified}</p><p className="font-bold text-lg text-gray-800">18</p></div></CardContent></Card>
    </div>
  </div>
);

const ProfilePage = ({ t }: { t: any }) => (
  <div className="p-4 pt-8 pb-24 text-center">
    <User className="mx-auto w-16 h-16 text-gray-400 mb-4" />
    <h1 className="text-2xl font-bold text-gray-800">{t.merchantProfile}</h1>
    <p className="text-gray-600 mt-2">Manage your account details and business information.</p>
    <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
      <Card className="p-4"><h3 className="font-semibold text-lg mb-2">{t.businessInfo}</h3><p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{t.name}:</span> ABC General Store</p><p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{t.upiId}:</span> abcstore@paytm</p></Card>
      <Card className="p-4"><h3 className="font-semibold text-lg mb-2">{t.contact}</h3><p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{t.phone}:</span> +91 98765 43210</p><p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{t.email}:</span> abc.store@business.com</p></Card>
    </div>
  </div>
);

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [appMessage, setAppMessage] = useState<{ message: string, type: string } | null>(null);
  const [historyItems, setHistoryItems] = useState(initialHistory);
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  const addToHistory = useCallback((item: any) => {
    setHistoryItems(prevItems => {
        const newItem = { ...item, id: prevItems.length + 1, time: item.time.toISOString() };
        return [...prevItems, newItem];
    });
  }, []);

  const renderPage = () => {
    if (activePage === 'dashboard') return <DashboardPage setAppMessage={setAppMessage} addToHistory={addToHistory} t={t} />;
    if (activePage === 'history') return <HistoryPage recentItems={historyItems} t={t} />;
    if (activePage === 'reports') return <ReportsPage t={t} />;
    if (activePage === 'profile') return <ProfilePage t={t} />;
    return <div className="p-4 pt-8 text-center">{t.noTransactionsDisplayed}</div>;
  };

  const BottomNavigation = () => {
    const getIsActive = (page: string) => activePage === page;
    const navItems = [
      { page: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
      { page: 'history', icon: History, label: t.history },
      { page: 'reports', icon: BarChart3, label: t.reports },
      { page: 'profile', icon: Settings2, label: t.profile },
    ];
    return (
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <div key={item.page} onClick={() => setActivePage(item.page)} className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${getIsActive(item.page) ? 'text-[#2968B4] font-medium' : 'text-gray-500'}`}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen relative overflow-y-auto">
        <header className="bg-[#2968B4] text-white p-4 shadow-md rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Shield className="text-[#2968B4] text-lg" /></div>
              <div><h1 className="text-lg font-semibold">FraudShield</h1><p className="text-blue-200 text-sm">{t.merchantDashboard}</p></div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-white hover:bg-blue-600"><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" className="text-white hover:bg-blue-600" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}><Globe className="h-5 w-5" /></Button>
            </div>
          </div>
        </header>
        
        {renderPage()}
        
        {appMessage && <MessageToast message={appMessage.message} type={appMessage.type} onClose={() => setAppMessage(null)} />}
        
        <BottomNavigation />
      </div>

      <style jsx>{`
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes pulseSuccess { 0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); } }
        .pulse-success { animation: pulseSuccess 2s infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes slide-in-up { from { transform: translate(-50%, 100%); } to { transform: translate(-50%, 0); } }
        .animate-slide-in-up { animation: slide-in-up 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
