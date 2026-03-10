"""
Tests for the Computer Vision Image Processing module.
"""

import sys
import numpy as np
import pytest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from image_processing import ImageProcessor


@pytest.fixture
def processor():
    return ImageProcessor()


@pytest.fixture
def gray_image():
    np.random.seed(42)
    return np.random.randint(0, 256, (20, 20), dtype=np.uint8)


@pytest.fixture
def rgb_image():
    np.random.seed(42)
    return np.random.randint(0, 256, (20, 20, 3), dtype=np.uint8)


class TestConvolution:
    def test_blur_filter(self, processor, gray_image):
        result = processor.apply_filter(gray_image, "blur")
        assert result.shape == gray_image.shape
        assert result.dtype == np.uint8

    def test_edge_detect(self, processor, gray_image):
        result = processor.apply_filter(gray_image, "edge_detect")
        assert result.shape == gray_image.shape

    def test_sharpen_filter(self, processor, gray_image):
        result = processor.apply_filter(gray_image, "sharpen")
        assert result.shape == gray_image.shape

    def test_rgb_convolution(self, processor, rgb_image):
        result = processor.apply_filter(rgb_image, "blur")
        assert result.shape == rgb_image.shape

    def test_unknown_filter(self, processor, gray_image):
        with pytest.raises(ValueError):
            processor.apply_filter(gray_image, "unknown_filter")

    def test_custom_kernel(self, processor, gray_image):
        kernel = np.ones((3, 3), dtype=np.float64) / 9.0
        result = processor.convolve2d(gray_image, kernel)
        assert result.shape == gray_image.shape


class TestHistogram:
    def test_histogram_shape(self, processor, gray_image):
        hist = processor.histogram(gray_image)
        assert hist.shape == (256,)
        assert hist.sum() == gray_image.size

    def test_histogram_equalization(self, processor, gray_image):
        result = processor.histogram_equalization(gray_image)
        assert result.shape == gray_image.shape
        assert result.dtype == np.uint8

    def test_histogram_rgb_input(self, processor, rgb_image):
        hist = processor.histogram(rgb_image)
        assert hist.shape == (256,)


class TestColorConversion:
    def test_rgb_to_grayscale(self, processor, rgb_image):
        gray = processor.rgb_to_grayscale(rgb_image)
        assert gray.ndim == 2
        assert gray.shape == rgb_image.shape[:2]

    def test_rgb_to_hsv(self, processor, rgb_image):
        hsv = processor.rgb_to_hsv(rgb_image)
        assert hsv.shape == rgb_image.shape

    def test_grayscale_invalid_input(self, processor, gray_image):
        with pytest.raises(ValueError):
            processor.rgb_to_grayscale(gray_image)


class TestTransforms:
    def test_resize(self, processor, gray_image):
        result = processor.resize(gray_image, 10, 10)
        assert result.shape == (10, 10)

    def test_resize_rgb(self, processor, rgb_image):
        result = processor.resize(rgb_image, 10, 15)
        assert result.shape == (10, 15, 3)

    def test_resize_upscale(self, processor, gray_image):
        result = processor.resize(gray_image, 40, 40)
        assert result.shape == (40, 40)

    def test_rotate_90(self, processor, gray_image):
        result = processor.rotate_90(gray_image, 1)
        assert result.shape == (20, 20)

    def test_flip_horizontal(self, processor, gray_image):
        result = processor.flip_horizontal(gray_image)
        assert result.shape == gray_image.shape
        np.testing.assert_array_equal(result[:, 0], gray_image[:, -1])

    def test_flip_vertical(self, processor, gray_image):
        result = processor.flip_vertical(gray_image)
        np.testing.assert_array_equal(result[0, :], gray_image[-1, :])


class TestTemplateMatching:
    def test_template_match(self, processor):
        image = np.zeros((20, 20), dtype=np.uint8)
        image[5:10, 5:10] = 200
        template = np.zeros((5, 5), dtype=np.uint8)
        template[:] = 200
        row, col, score = processor.template_match(image, template)
        assert row == 5
        assert col == 5
        assert score > 0.9

    def test_template_match_rgb(self, processor):
        image = np.zeros((20, 20, 3), dtype=np.uint8)
        image[5:10, 5:10, :] = 200
        template = np.full((5, 5, 3), 200, dtype=np.uint8)
        row, col, score = processor.template_match(image, template)
        assert score > 0.5


class TestImageStats:
    def test_stats(self, processor, gray_image):
        stats = processor.get_image_stats(gray_image)
        assert "shape" in stats
        assert "mean" in stats
        assert 0 <= stats["min"] <= stats["max"] <= 255


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
