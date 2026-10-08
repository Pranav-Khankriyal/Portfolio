from PIL import Image
import numpy as np

img = Image.open(r'd:\Projects\port\simple\30e0a70f-b77f-4439-846b-fa97a925a351.png').convert('RGBA')
data = np.array(img, dtype=np.uint8)

r, g, b = data[:,:,0].astype(np.float32), data[:,:,1].astype(np.float32), data[:,:,2].astype(np.float32)

# Background is very near-white
fully_transparent = (r > 230) & (g > 230) & (b > 230)
feathered = (r > 205) & (g > 205) & (b > 205) & ~fully_transparent

alpha = np.full((data.shape[0], data.shape[1]), 255, dtype=np.float32)
alpha[fully_transparent] = 0
brightness_edge = (r[feathered] + g[feathered] + b[feathered]) / 3
alpha[feathered] = ((brightness_edge - 205) / 25 * 160).clip(0, 160)

data[:,:,3] = alpha.astype(np.uint8)
result = Image.fromarray(data)
result.save('d:/Projects/port/simple/pranav_nobg.png')
print('Done! Saved pranav_nobg.png')
