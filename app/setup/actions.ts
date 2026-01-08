"use server";

export async function getPaperVersions() {
  try {
    const res = await fetch("https://api.papermc.io/v2/projects/paper", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "MC-Dash/1.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Paper versions: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching Paper versions:", error);
    throw error;
  }
}

export async function getPaperDownloadLink(version: string) {
  if (!/^[a-zA-Z0-9.-]+$/.test(version)) {
    throw new Error("Invalid version format");
  }

  try {
    const buildsRes = await fetch(
      `https://api.papermc.io/v2/projects/paper/versions/${encodeURIComponent(version)}/builds`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "MC-Dash/1.0",
        },
      },
    );

    if (!buildsRes.ok) {
      throw new Error("Failed to fetch Paper builds");
    }

    const buildsData = await buildsRes.json();
    // Builds are typically returned in ascending order, so the last one is the latest.
    const latestBuild = buildsData.builds[buildsData.builds.length - 1];

    if (!latestBuild || !/^[0-9]+$/.test(String(latestBuild.build))) {
      throw new Error("No builds found for this version");
    }

    const buildInfoRes = await fetch(
      `https://api.papermc.io/v2/projects/paper/versions/${encodeURIComponent(version)}/builds/${encodeURIComponent(latestBuild.build)}`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "MC-Dash/1.0",
        },
      },
    );

    if (!buildInfoRes.ok) {
      throw new Error("Failed to fetch build info");
    }

    const buildInfo = await buildInfoRes.json();
    const downloadName = buildInfo.downloads.application.name;

    return `https://api.papermc.io/v2/projects/paper/versions/${encodeURIComponent(version)}/builds/${encodeURIComponent(latestBuild.build)}/downloads/${encodeURIComponent(downloadName)}`;
  } catch (error) {
    console.error("Error getting Paper download link:", error);
    throw error;
  }
}
