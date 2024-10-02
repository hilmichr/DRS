import numpy as np
import trimesh
import trimesh.voxel.creation

def load_gltf_model(file_path):
    # Lädt eine Szene aus einer glTF-Datei
    scene = trimesh.load(file_path)
    # Extrahiert das Mesh aus der Szene
    if isinstance(scene, trimesh.Scene):
        mesh = trimesh.util.concatenate(scene.dump())
    else:
        mesh = scene
    return mesh

def voxelize_model(mesh, voxel_size):
    # Voxelisiert ein 3D-Modell
    return trimesh.voxel.creation.voxelize(mesh, pitch=voxel_size)

def export_voxelized_model(voxel_model, output_path):
    # Konvertiert das Voxelmodell zurück in ein Mesh
    mesh = voxel_model.marching_cubes
    # Exportiert das Mesh als glTF-Modell
    mesh_bytes = mesh.export(file_type='glb')
    # Schreibt die binären Daten in die Ausgabedatei
    with open(output_path, 'wb') as f:
        f.write(mesh_bytes)


def main(input_file, output_file, voxel_size=0.1):
    # Lädt das glTF-Modell
    mesh = load_gltf_model(input_file)
    
    # Voxelisiert das Modell
    voxel_model = voxelize_model(mesh, voxel_size)
    
    # Exportiert das voxelisierte Modell
    export_voxelized_model(voxel_model, output_file)

# Beispielaufruf
input_file = 'input_model.glb'
output_file = 'output_voxelized_model.gltf'
main(input_file, output_file, voxel_size=0.1)


#verwendet den gltf-Exporter von trimesh statt des mesh.export-Befehls
#verwendet wb (write binary) als Modus für das Öffnen der Datei und 
#schreibt die binären Daten direkt hinein, ohne sie zu serialisieren damit wir keine separaten bin-Dateien haben