import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll } from 'lucide-react';

const PaymentSuccessModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="animate-fade-in-up">
        <Card className="w-full max-w-md mx-4 bg-stone-100 border-2 border-red-900">
          {/* Decorative top border inspired by Japanese patterns */}
          <div className="h-2 bg-red-900 w-full flex">
            <div className="w-1/4 h-full bg-black"></div>
            <div className="w-1/4 h-full bg-red-800"></div>
            <div className="w-1/4 h-full bg-black"></div>
            <div className="w-1/4 h-full bg-red-800"></div>
          </div>
          
          <CardHeader className="text-center pt-8">
            <CardTitle className="flex flex-col items-center gap-4 text-red-900">
              <div className="relative">
                <Scroll className="h-16 w-16 text-red-900" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-2xl font-bold">成功</span>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-wide">
                Order Confirmed
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6 px-8 pb-8">
            <div className="space-y-4">
              <p className="text-gray-800 font-medium">
                Thank you for your honorable purchase, noble customer.
              </p>
              <p className="text-sm text-gray-600">
                A scroll of confirmation shall be delivered to your message box shortly.
              </p>
            </div>

            <div className="relative">
              <Button 
                onClick={onClose}
                className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3
                          transition-all duration-300 border border-red-950"
              >
                Continue Your Shopping
              </Button>
              
              {/* Decorative corner elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-red-900"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-red-900"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-red-900"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-red-900"></div>
            </div>
          </CardContent>

          {/* Decorative bottom border */}
          <div className="h-2 bg-red-900 w-full flex">
            <div className="w-1/4 h-full bg-black"></div>
            <div className="w-1/4 h-full bg-red-800"></div>
            <div className="w-1/4 h-full bg-black"></div>
            <div className="w-1/4 h-full bg-red-800"></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;