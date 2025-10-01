"""_
Sample test case
"""
from django.test import SimpleTestCase

from app import calc


class CalcTests(SimpleTestCase):
    """_
    Sample test case
    """
    def test_add_numbers(self):
        """_
        Sample test case
        """
        self.assertEqual(calc.add(3, 8), 11)

    def test_subtract_numbers(self):
        """_
        Sample test case
        """
        self.assertEqual(calc.subtract(11, 5), 6)

    def test_divide_numbers(self):
        """_
        Sample test case
        """
        self.assertEqual(calc.divide(10, 5), 2)
