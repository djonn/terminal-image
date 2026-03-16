declare module "png-js" {
  declare class PNG {
    // Constructor
    constructor(data: Buffer);

    // Static methods
    static decode(path: string, fn: (pixels: Buffer) => void): void;
    static load(path: string): PNG;

    // Instance properties
    data: Buffer;
    pos: number;
    palette: number[];
    imgData: number[];
    transparency: {
      indexed?: number[];
      grayscale?: number;
      rgb?: number[];
    };
    text: { [key: string]: string };
    width: number;
    height: number;
    bits?: number;
    colorType?: number;
    compressionMethod?: number;
    filterMethod?: number;
    interlaceMethod?: number;
    colors?: number;
    hasAlphaChannel?: boolean;
    pixelBitlength?: number;
    colorSpace?: string;
    _decodedPalette?: Buffer;

    // Instance methods
    read(bytes: number): number[];
    readUInt32(): number;
    readUInt16(): number;
    decodePixels(fn: (pixels: Buffer) => void): void;
    decodePalette(): Buffer;
    copyToImageData(imageData: Buffer | ImageData, pixels: Buffer): void;
    decode(fn: (pixels: Buffer) => void): void;
  }

  export = PNG;
}
