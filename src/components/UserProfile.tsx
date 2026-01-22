import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { User, Shield, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface UserProfileProps {
  compact?: boolean;
}

export function UserProfile({ compact = false }: UserProfileProps) {
  const user = {
    name: 'Mission Control',
    role: 'ISRO Security Analyst',
    username: 'mission.control',
    clearanceLevel: 'Level 5 - Top Secret',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 rounded-lg border"
      >
        <Avatar className="h-10 w-10 border-2 border-orange-600">
          <AvatarFallback className="bg-orange-600 text-white">MC</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.username}</p>
        </div>
        <Badge variant="outline" className="text-xs border-orange-600 text-orange-600">
          <Shield className="h-3 w-3 mr-1" />
          L5
        </Badge>
      </motion.div>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border-2">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-4 border-orange-600 shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-orange-600 to-orange-500 text-white text-xl">
            MC
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            <Badge className="bg-orange-600">
              <Shield className="h-3 w-3 mr-1" />
              {user.clearanceLevel}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.username}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Active 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
