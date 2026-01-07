/* eslint-disable */
import { metric } from "../containers/Metrics/configs/Metric";
import BookmarkableLinks from "../containers/Dashboard/BookmarkedLinks";
import ScheduledActivities from "../containers/Dashboard/ScheduledActivities";
import PinnedContacts from "../containers/Dashboard/PinnedContacts";
import Announcements from "../containers/Dashboard/Announcements";
import Links from "../containers/Dashboard/Links";
import TasksContainer from "../containers/Dashboard/Tasks";
import QueueParticipation from "../containers/Dashboard/QueueParticipation";

export const METRIC_QUICK_LINKS = "quick_links";
export const METRIC_SCHEDULED_ACTIVITIES = "scheduled_activities";
export const METRIC_PINNED_CONTACTS = "pinned_contacts";
export const METRIC_ANNOUNCEMENTS = "announcements";
export const METRIC_LINKS = "links";
export const METRIC_TASKS = "tasks";
export const METRIC_QUEUE_PARTICIPATION = "queue_participation";

export const ALL_METRICS = [
  METRIC_QUICK_LINKS,
  METRIC_SCHEDULED_ACTIVITIES,
  METRIC_PINNED_CONTACTS,
  METRIC_ANNOUNCEMENTS,
  METRIC_LINKS,
  METRIC_TASKS,
  METRIC_QUEUE_PARTICIPATION,
];

export const METRIC_CHART_TYPE_QUICK_LINKS = "quick_links_card";
export const METRIC_CHART_TYPE_SCHEDULED_ACTIVITIES =
  "scheduled_activities_card";
export const METRIC_CHART_TYPE_PINNED_CONTACTS = "pinned_contacts_card";
export const METRIC_CHART_TYPE_ANNOUNCEMENTS = "announcements_table";
export const METRIC_CHART_TYPE_LINKS = "links_table";
export const METRIC_CHART_TYPE_TASKS = "tasks_table";
export const METRIC_CHART_TYPE_QUEUE_PARTICIPATION = "queue_participation_card";

metric("common", METRIC_QUICK_LINKS, "Quick Links")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_QUICK_LINKS, "Quick Links")
  .addChartComponent(
    METRIC_CHART_TYPE_QUICK_LINKS,
    "Quick Links Card",
    BookmarkableLinks
  )
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: false,
    default: "Quick Links",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// // Scheduled Activities
metric("common", METRIC_SCHEDULED_ACTIVITIES, "Scheduled Activities")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_SCHEDULED_ACTIVITIES, "Scheduled Activities")
  .addChartComponent(
    METRIC_CHART_TYPE_SCHEDULED_ACTIVITIES,
    "Scheduled Activities Card",
    ScheduledActivities
  )
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Scheduled Activities",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// Pinned Contacts
metric("common", METRIC_PINNED_CONTACTS, "Pinned Contacts")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_PINNED_CONTACTS, "Pinned Contacts")
  .addChartComponent(
    METRIC_CHART_TYPE_PINNED_CONTACTS,
    "Pinned Contacts Card",
    PinnedContacts
  )
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Pinned Contacts",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// // Announcements
metric("common", METRIC_ANNOUNCEMENTS, "Announcements")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_ANNOUNCEMENTS, "Announcements")
  .addChartComponent(
    METRIC_CHART_TYPE_ANNOUNCEMENTS,
    "Announcement Table",
    Announcements
  )
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Announcements",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// Links
metric("common", METRIC_LINKS, "Links")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_LINKS, "Links")
  .addChartComponent(METRIC_CHART_TYPE_LINKS, "Links Table", Links)
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Links",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// Tasks
metric("common", METRIC_TASKS, "Tasks")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_TASKS, "Tasks")
  .addChartComponent(METRIC_CHART_TYPE_TASKS, "Task Table", TasksContainer)
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Tasks",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();

// Queue Participation
metric("common", METRIC_QUEUE_PARTICIPATION, "Queue Participation")
  .metricConfigs()
  .setAllowedTimeframes([])
  .setAllowedAggregations([])
  .metricConfigsEnd()
  .addChart(METRIC_QUEUE_PARTICIPATION, "Queue Participation")
  .addChartComponent(
    METRIC_CHART_TYPE_QUEUE_PARTICIPATION,
    "Queue Participation Card",
    QueueParticipation
  )
  .componentSettings()
  .useItemWrapper(false)
  .dataGridSize({ minW: 2, minH: 2 })
  .dataGridConfigs({ isResizable: true })
  .componentSettingsEnd()
  .componentUserSettings()
  .addUserSettings({
    name: "title",
    title: "Chart Title",
    type: "text",
    required: true,
    default: "Queue Participation",
  })
  .componentUserSettingsEnd()
  .addChartComponentEnd()
  .addChartEnd();
