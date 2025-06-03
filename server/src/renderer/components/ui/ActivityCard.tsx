import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

export interface ActivityItem {
  id: number | string;
  title: string;
  description?: string;
  time: string;
  icon: ReactNode;
  iconColorClass?: string;
  iconBgClass?: string;
}

export interface ActivityCardProps {
  title: string;
  activities: ActivityItem[];
  emptyMessage?: string;
  maxItems?: number;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  activities,
  emptyMessage = "No recent activity",
  maxItems = 5,
  className = ''
}) => {
  const displayActivities = activities.slice(0, maxItems);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        {displayActivities.length > 0 ? (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.07
                }
              }
            }}
          >
            {displayActivities.map((activity, index) => (
              <motion.li
                key={activity.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center py-2 border-b border-border last:border-0 hover:bg-slate-50 rounded-lg p-2 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`p-2 rounded-full ${activity.iconBgClass || 'bg-primary/10'} ${activity.iconColorClass || 'text-primary'} mr-3`}
                >
                  {activity.icon}
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                </div>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-xs text-muted-foreground ml-2 whitespace-nowrap"
                >
                  {activity.time}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-8 text-center text-muted-foreground"
          >
            {emptyMessage}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}; 