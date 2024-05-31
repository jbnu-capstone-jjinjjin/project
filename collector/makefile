CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++11
LDFLAGS = -lgdi32 -lgdiplus

TARGET = ./public/getScreenshot.exe
SRC = ./lib/getScreenshot.cpp

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC) $(LDFLAGS)
