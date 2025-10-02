import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const JobCardSkeleton: React.FC = () => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex w-full space-x-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCardSkeleton;
