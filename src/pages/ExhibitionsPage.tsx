import React from 'react';
import ExhibitionCard from '../components/ExhibitionCard';
import { useData } from '../contexts/DataContext';

const ExhibitionsPage: React.FC = () => {
  const { exhibitions } = useData();
  
  // Separate exhibitions by status
  const upcomingExhibitions = exhibitions.filter((e) => e.status === 'upcoming');
  const currentExhibitions = exhibitions.filter((e) => e.status === 'current');
  const pastExhibitions = exhibitions.filter((e) => e.status === 'past');
  
  // Sort each group by date
  const sortByStartDate = (a: any, b: any) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  };
  
  upcomingExhibitions.sort(sortByStartDate);
  currentExhibitions.sort(sortByStartDate);
  pastExhibitions.sort(sortByStartDate);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight mb-4">
          Exhibitions
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center">
          Browse current, upcoming, and past exhibitions
        </p>
      </div>
      
      {currentExhibitions.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Current Exhibitions
          </h2>
          <div className="space-y-8">
            {currentExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        </section>
      )}
      
      {upcomingExhibitions.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Upcoming Exhibitions
          </h2>
          <div className="space-y-8">
            {upcomingExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        </section>
      )}
      
      {pastExhibitions.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Past Exhibitions
          </h2>
          <div className="space-y-8">
            {pastExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        </section>
      )}
      
      {exhibitions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No exhibitions are currently listed.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExhibitionsPage;