#include <windows.h>
#include <gdiplus.h>
#include <iostream>

#pragma comment(lib, "Gdiplus.lib")

using namespace Gdiplus;
using namespace std;

int GetEncoderClsid(const WCHAR* format, CLSID* pClsid) {
    UINT num = 0;
    UINT size = 0;
    ImageCodecInfo* pImageCodecInfo = NULL;

    GetImageEncodersSize(&num, &size);
    if (size == 0)
        return -1;

    pImageCodecInfo = (ImageCodecInfo*)(malloc(size));
    if (pImageCodecInfo == NULL)
        return -1;

    GetImageEncoders(num, size, pImageCodecInfo);

    for (UINT j = 0; j < num; ++j) {
        if (wcscmp(pImageCodecInfo[j].MimeType, format) == 0) {
            *pClsid = pImageCodecInfo[j].Clsid;
            free(pImageCodecInfo);
            return j;
        }
    }

    free(pImageCodecInfo);
    return -1;
}

void CaptureScreen(const WCHAR* filename) {
    GdiplusStartupInput gdiplusStartupInput;
    ULONG_PTR gdiplusToken;
    GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, NULL);

    HDC hdcScreen = GetDC(NULL);
    HDC hdcMemDC = CreateCompatibleDC(hdcScreen);

    int screenWidth = 4096;
    int screenHeight =2160;

    // 화면 크기를 출력하여 확인
    cout << "Screen Width: " << screenWidth << ", Screen Height: " << screenHeight << endl;

    HBITMAP hbmScreen = CreateCompatibleBitmap(hdcScreen, screenWidth, screenHeight);
    SelectObject(hdcMemDC, hbmScreen);

    // 전체 화면 캡처
    BitBlt(hdcMemDC, 0, 0, screenWidth, screenHeight, hdcScreen, 0, 0, SRCCOPY);

    Bitmap* bitmap = new Bitmap(hbmScreen, NULL);

    CLSID clsid;
    GetEncoderClsid(L"image/png", &clsid);
    bitmap->Save(filename, &clsid, NULL);

    delete bitmap;
    DeleteObject(hbmScreen);
    DeleteDC(hdcMemDC);
    ReleaseDC(NULL, hdcScreen);

    GdiplusShutdown(gdiplusToken);
}

int main() {
    CaptureScreen(L"screenshot.png");
    cout << "Screenshot captured successfully." << endl;
    return 0;
}
