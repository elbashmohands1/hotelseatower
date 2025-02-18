import { 
  WifiIcon, 
  TvIcon,
  HomeModernIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const amenities = [
  {
    icon: WifiIcon,
    title: 'Free Wi-Fi',
    description: 'Stay connected with high-speed internet access throughout the hotel.'
  },
  {
    icon: TvIcon,
    title: 'Smart TV',
    description: 'Enjoy premium entertainment with smart TVs in every room.'
  },
  {
    icon: HomeModernIcon,
    title: 'Luxury Spa',
    description: 'Relax and rejuvenate at our world-class spa facility.'
  },
  {
    icon: SparklesIcon,
    title: 'Room Service',
    description: '24/7 room service available for your convenience.'
  }
];

export default function Amenities() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Hotel Amenities
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Experience luxury with our premium amenities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <amenity.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {amenity.title}
                </h3>
                <p className="text-gray-600">
                  {amenity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 