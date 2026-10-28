"""Reproduce normalized photo estimates; input pixels are manually selected, not CAD."""
import json
from pathlib import Path
source = 'https://consumer.huawei.com/cn/support/content/zh-cn16119818/'
points = {
 'rear_left': [128,556], 'rear_right': [537,556], 'rear_top': [333,127],
 'rear_bottom': [333,984], 'ring_left': [177,316], 'ring_right': [489,316],
 'ring_top': [333,159], 'ring_bottom': [333,473], 'medallion_left': [266,316],
 'medallion_right': [400,316], 'main_camera': [231,316],
 'ultrawide': [331,219], 'telephoto': [432,316], 'flash': [333,414],
 'textile_bottom': [333,774], 'rear_corner_tangent': [180,127]
}
out = {'sourceUrl':source,'capturedAt':'2026-10-27','tier':'photo_inferred',
 'imageSize':[1798,1025], 'bodyBounds':[128,127,537,984],
 'method':'Manual pixel landmarks on the supplied official annotated rear view; width-normalized. No lens metadata or perspective correction available.',
 'estimatedUncertainty':'landmarks +/- 4 px; ring edges +/- 6 px; overall photo projection +/- 3%; do not treat as mechanical metrology',
 'points':{k:{'pixel':p,'normalized':[round((p[0]-332.5)/409,5),round((555.5-p[1])/409,5)],
 'projectedMM':[round((p[0]-332.5)*78.7/409,2),round((555.5-p[1])*78.7/409,2)]}for k,p in points.items()}}
Path('docs/reference/calibration.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print('Wrote 16 landmarks. Ring/body ratio:',round(312/409,4))
