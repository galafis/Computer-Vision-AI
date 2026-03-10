"""
Image Processing Module
Core image operations: convolution, filtering, histogram, color space, transforms.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple


class ImageProcessor:
    """Provides image processing operations on NumPy arrays."""

    # Pre-defined convolution kernels
    KERNELS = {
        "blur": np.array([[1, 1, 1], [1, 1, 1], [1, 1, 1]], dtype=np.float64) / 9.0,
        "gaussian_blur": np.array(
            [[1, 2, 1], [2, 4, 2], [1, 2, 1]], dtype=np.float64
        ) / 16.0,
        "sharpen": np.array(
            [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float64
        ),
        "edge_detect": np.array(
            [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], dtype=np.float64
        ),
        "sobel_x": np.array(
            [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float64
        ),
        "sobel_y": np.array(
            [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float64
        ),
        "emboss": np.array(
            [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]], dtype=np.float64
        ),
    }

    def convolve2d(self, image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        """
        Apply 2D convolution on a single-channel image.

        Args:
            image: 2D array (H, W) with pixel values.
            kernel: 2D convolution kernel.

        Returns:
            Convolved image array.
        """
        if image.ndim == 3:
            # Apply to each channel
            channels = [
                self._convolve_single(image[:, :, c], kernel)
                for c in range(image.shape[2])
            ]
            return np.stack(channels, axis=2)
        return self._convolve_single(image, kernel)

    def _convolve_single(self, image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        """Convolution on a single 2D channel."""
        kh, kw = kernel.shape
        ph, pw = kh // 2, kw // 2
        h, w = image.shape

        # Zero-pad
        padded = np.zeros((h + 2 * ph, w + 2 * pw), dtype=np.float64)
        padded[ph : ph + h, pw : pw + w] = image

        output = np.zeros_like(image, dtype=np.float64)
        for i in range(h):
            for j in range(w):
                region = padded[i : i + kh, j : j + kw]
                output[i, j] = np.sum(region * kernel)

        return np.clip(output, 0, 255).astype(np.uint8)

    def apply_filter(self, image: np.ndarray, filter_name: str) -> np.ndarray:
        """Apply a named filter to an image."""
        if filter_name not in self.KERNELS:
            raise ValueError(f"Unknown filter: {filter_name}. Available: {list(self.KERNELS.keys())}")
        return self.convolve2d(image, self.KERNELS[filter_name])

    def histogram(self, image: np.ndarray) -> np.ndarray:
        """Compute histogram for a grayscale image (256 bins)."""
        if image.ndim == 3:
            image = self.rgb_to_grayscale(image)
        hist = np.zeros(256, dtype=np.int64)
        for val in image.flatten():
            hist[int(val)] += 1
        return hist

    def histogram_equalization(self, image: np.ndarray) -> np.ndarray:
        """Apply histogram equalization to enhance contrast."""
        if image.ndim == 3:
            gray = self.rgb_to_grayscale(image)
        else:
            gray = image.copy()

        hist = self.histogram(gray)
        cdf = np.cumsum(hist).astype(np.float64)
        cdf_min = cdf[cdf > 0].min()
        total = gray.size

        # Normalize CDF to [0, 255]
        cdf_normalized = ((cdf - cdf_min) / (total - cdf_min) * 255.0)
        cdf_normalized = np.clip(cdf_normalized, 0, 255).astype(np.uint8)

        return cdf_normalized[gray.astype(np.int32)]

    def rgb_to_grayscale(self, image: np.ndarray) -> np.ndarray:
        """Convert RGB image to grayscale using luminance formula."""
        if image.ndim != 3 or image.shape[2] != 3:
            raise ValueError("Input must be an RGB image (H, W, 3)")
        return (
            0.2989 * image[:, :, 0]
            + 0.5870 * image[:, :, 1]
            + 0.1140 * image[:, :, 2]
        ).astype(np.uint8)

    def rgb_to_hsv(self, image: np.ndarray) -> np.ndarray:
        """Convert RGB image to HSV color space."""
        img = image.astype(np.float64) / 255.0
        r, g, b = img[:, :, 0], img[:, :, 1], img[:, :, 2]

        cmax = np.maximum(np.maximum(r, g), b)
        cmin = np.minimum(np.minimum(r, g), b)
        delta = cmax - cmin

        # Hue
        h = np.zeros_like(delta)
        mask = delta > 0
        r_mask = mask & (cmax == r)
        g_mask = mask & (cmax == g)
        b_mask = mask & (cmax == b)

        h[r_mask] = 60 * (((g[r_mask] - b[r_mask]) / delta[r_mask]) % 6)
        h[g_mask] = 60 * (((b[g_mask] - r[g_mask]) / delta[g_mask]) + 2)
        h[b_mask] = 60 * (((r[b_mask] - g[b_mask]) / delta[b_mask]) + 4)

        # Saturation
        s = np.where(cmax > 0, delta / cmax, 0)

        # Value
        v = cmax

        return np.stack([h, s * 255, v * 255], axis=2).astype(np.uint8)

    def resize(self, image: np.ndarray, new_h: int, new_w: int) -> np.ndarray:
        """Resize image using nearest-neighbor interpolation."""
        h, w = image.shape[:2]
        row_indices = (np.arange(new_h) * h / new_h).astype(int)
        col_indices = (np.arange(new_w) * w / new_w).astype(int)
        row_indices = np.clip(row_indices, 0, h - 1)
        col_indices = np.clip(col_indices, 0, w - 1)

        if image.ndim == 3:
            return image[np.ix_(row_indices, col_indices, np.arange(image.shape[2]))]
        return image[np.ix_(row_indices, col_indices)]

    def rotate_90(self, image: np.ndarray, times: int = 1) -> np.ndarray:
        """Rotate image by 90 degrees clockwise."""
        times = times % 4
        result = image
        for _ in range(times):
            if result.ndim == 3:
                result = np.transpose(result[::-1, :, :], (1, 0, 2))
            else:
                result = np.transpose(result[::-1, :], (1, 0))
        return result

    def flip_horizontal(self, image: np.ndarray) -> np.ndarray:
        """Flip image horizontally."""
        return image[:, ::-1].copy()

    def flip_vertical(self, image: np.ndarray) -> np.ndarray:
        """Flip image vertically."""
        return image[::-1, :].copy()

    def template_match(
        self, image: np.ndarray, template: np.ndarray
    ) -> Tuple[int, int, float]:
        """
        Find the best match location of a template in an image.
        Uses normalized cross-correlation on grayscale.

        Returns:
            (row, col, score) of best match location.
        """
        if image.ndim == 3:
            image = self.rgb_to_grayscale(image)
        if template.ndim == 3:
            template = self.rgb_to_grayscale(template)

        img = image.astype(np.float64)
        tmpl = template.astype(np.float64)
        th, tw = tmpl.shape
        ih, iw = img.shape

        tmpl_mean = tmpl - tmpl.mean()
        tmpl_norm = np.sqrt(np.sum(tmpl_mean ** 2))
        if tmpl_norm == 0:
            return (0, 0, 0.0)

        best_score = -1.0
        best_loc = (0, 0)

        for i in range(ih - th + 1):
            for j in range(iw - tw + 1):
                region = img[i : i + th, j : j + tw]
                region_mean = region - region.mean()
                region_norm = np.sqrt(np.sum(region_mean ** 2))
                if region_norm == 0:
                    continue
                score = np.sum(tmpl_mean * region_mean) / (tmpl_norm * region_norm)
                if score > best_score:
                    best_score = score
                    best_loc = (i, j)

        return (best_loc[0], best_loc[1], float(best_score))

    def get_image_stats(self, image: np.ndarray) -> Dict:
        """Get basic statistics of an image."""
        return {
            "shape": image.shape,
            "dtype": str(image.dtype),
            "min": int(image.min()),
            "max": int(image.max()),
            "mean": float(image.mean()),
            "std": float(image.std()),
        }
