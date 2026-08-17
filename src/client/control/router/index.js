import Vue from "vue"
import Router from "vue-router"

import Updates from "@/pages/Updates"

import Settings from "@/pages/Settings"
import Outputs from "@/pages/Outputs"
import Development from "@/pages/Development"
import ColorSettings from "@/pages/ColorSettings"
import SizeSettings from "@/pages/SizeSettings"
import Animations from "@/pages/Animations"
import MediaFiles from "@/pages/MediaFiles"
import Themes from "@/pages/Themes"
import ThemeEditor from "@/pages/ThemeEditor"
import Widgets from "@/pages/Widgets"
import Widget from "@/pages/Widget"

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: "/updates",
			name: "Updates",
			component: Updates
		},
		{
			path: "/settings",
			name: "Settings",
			component: Settings
		},
		{
			path: "/development",
			name: "Development",
			component: Development
		},
		{
			path: "/colorsettings",
			name: "Color Settings",
			component: ColorSettings
		},
		{
			path: "/outputs",
			name: "Outputs",
			component: Outputs
		},
		{
			path: "/sizesettings",
			name: "Size Settings",
			component: SizeSettings
		},
		{
			path: "/animations",
			name: "Animations",
			component: Animations
		},
		{
			path: "/mediafiles",
			name: "Media Files",
			component: MediaFiles
		},
		{
			path: "/themes",
			name: "Themes",
			component: Themes
		},
		{
			path: "/theme_editor",
			name: "Theme Editor",
			component: ThemeEditor
		},
		{
			path: "/widgets",
			name: "Widgets",
			component: Widgets
		},
		{
			path: "/widget/:id",
			name: "Widget",
			component: Widget
		}
	],
	linkActiveClass: "active",
	linkExactActiveClass: "exact-active"
})
