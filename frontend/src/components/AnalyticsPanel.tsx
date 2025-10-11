import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Target } from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsPanelProps {
  data: AnalyticsData | null;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data }) => {
  if (!data || !data.skill_distribution || !data.top_skills || !data.recent_activity) {
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
    <div className="space-y-6">
      {/* First Row: Overview and Skill Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Overview
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {data.total_employees || 0}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {data.total_trainings || 0}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Trainings</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">Completion Rate</span>
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.completion_rate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Skill Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
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
      </div>

      {/* Second Row: Top Completed Skills (65%) and Recent Activity (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Top Skills - 65% width */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Top Completed Skills
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkillsData} layout="horizontal" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#6b7280" 
                  width={150}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
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

        {/* Recent Activity - 35% width */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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
    </div>
  );
};

export default AnalyticsPanel;
