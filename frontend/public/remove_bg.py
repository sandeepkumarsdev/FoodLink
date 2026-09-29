from PIL import Image

def remove_background(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    # Top left pixel as background color
    bg_color = datas[0]
    
    threshold = 50
    
    newData = []
    for item in datas:
        # Check if pixel is close to background color
        if (abs(item[0] - bg_color[0]) < threshold and 
            abs(item[1] - bg_color[1]) < threshold and 
            abs(item[2] - bg_color[2]) < threshold):
            
            # Make it fully transparent
            newData.append((255, 255, 255, 0))
        else:
            # Keep original pixel
            newData.append(item)
            
    img.putdata(newData)
    img.save(image_path, "PNG")

remove_background("logo.png")
