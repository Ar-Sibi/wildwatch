import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/image-upload.tsx"),
  route("video-upload", "routes/video-upload.tsx"),
  route("analytics", "routes/analytics.tsx"),
] satisfies RouteConfig;
