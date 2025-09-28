import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Target } from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsPanelProps {
  data: AnalyticsData | null;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="space-y-4">
        <div className="card p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = data.skill_distribution.map(item => ({
    name: item.label,
    value: item.count,
    color: item.color,
  }));

  const topSkillsData = data.top_skills.slice(0, 5).map(skill => ({
    name: skill.title.length > 15 ? skill.title.substring(0, 15) + '...' : skill.title,
    completed: skill.completed_count,
  }));

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.total_employees}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Employees</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.total_trainings}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Trainings</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
            </div>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {data.completion_rate}%
            </span>
          </div>
        </div>
      </div>

      {/* Skill Distribution */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skill Distribution
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [value, 'Count']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-1">
          {data.skill_distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Skills */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Completed Skills
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSkillsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
              <Tooltip 
                formatter={(value: any) => [value, 'Completed']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="completed" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {data.recent_activity.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.level === 2 ? 'bg-green-500' : 
                  activity.level === 1 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  {activity.employee_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {activity.column_title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(activity.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
