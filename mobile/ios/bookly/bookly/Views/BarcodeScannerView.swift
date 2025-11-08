//
//  BarcodeScannerView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI
import AVFoundation
import AudioToolbox

struct BarcodeScannerView: UIViewControllerRepresentable {
    @Binding var scannedISBN: String?
    @Binding var isScanning: Bool
    var onCameraError: ((String) -> Void)?
    
    func makeUIViewController(context: Context) -> ScannerViewController {
        let controller = ScannerViewController()
        controller.delegate = context.coordinator
        controller.onCameraError = { error in
            onCameraError?(error)
        }
        return controller
    }
    
    func updateUIViewController(_ uiViewController: ScannerViewController, context: Context) {
        if isScanning {
            uiViewController.startScanning()
        } else {
            uiViewController.stopScanning()
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, ScannerDelegate {
        let parent: BarcodeScannerView
        
        init(_ parent: BarcodeScannerView) {
            self.parent = parent
        }
        
        func didScanBarcode(_ code: String) {
            parent.scannedISBN = code
            parent.isScanning = false
        }
    }
}

protocol ScannerDelegate: AnyObject {
    func didScanBarcode(_ code: String)
}

class ScannerViewController: UIViewController {
    weak var delegate: ScannerDelegate?
    var onCameraError: ((String) -> Void)?
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupCamera()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        startScanning()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopScanning()
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        previewLayer?.frame = view.layer.bounds
    }
    
    func setupCamera() {
        // Check camera availability
        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else {
            onCameraError?("Camera not available. This may be because you're using the iOS Simulator. Please use a physical device or enter ISBN manually.")
            return
        }
        
        // Check camera permission
        let authStatus = AVCaptureDevice.authorizationStatus(for: .video)
        if authStatus == .denied || authStatus == .restricted {
            onCameraError?("Camera access denied. Please enable camera access in Settings.")
            return
        }
        
        if authStatus == .notDetermined {
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    if !granted {
                        self?.onCameraError?("Camera access denied. Please enable camera access in Settings.")
                    } else {
                        self?.setupCameraSession(device: videoCaptureDevice)
                    }
                }
            }
            return
        }
        
        setupCameraSession(device: videoCaptureDevice)
    }
    
    private func setupCameraSession(device: AVCaptureDevice) {
        
        let videoInput: AVCaptureDeviceInput
        
        do {
            videoInput = try AVCaptureDeviceInput(device: device)
        } catch {
            onCameraError?("Failed to initialize camera: \(error.localizedDescription)")
            return
        }
        
        let captureSession = AVCaptureSession()
        self.captureSession = captureSession
        
        if captureSession.canAddInput(videoInput) {
            captureSession.addInput(videoInput)
        } else {
            onCameraError?("Failed to add camera input")
            return
        }
        
        let metadataOutput = AVCaptureMetadataOutput()
        
        if captureSession.canAddOutput(metadataOutput) {
            captureSession.addOutput(metadataOutput)
            
            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.ean13, .ean8, .pdf417, .code128]
        } else {
            onCameraError?("Failed to add metadata output")
            return
        }
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        self.previewLayer = previewLayer
        
        // Add cutout overlay
        addCutoutOverlay()
    }
    
    func addCutoutOverlay() {
        let overlayView = UIView(frame: view.bounds)
        overlayView.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        overlayView.isUserInteractionEnabled = false
        
        // Create cutout
        let cutoutSize: CGFloat = 250
        let cutoutRect = CGRect(
            x: (view.bounds.width - cutoutSize) / 2,
            y: (view.bounds.height - cutoutSize) / 2,
            width: cutoutSize,
            height: cutoutSize
        )
        
        let path = UIBezierPath(rect: overlayView.bounds)
        let cutoutPath = UIBezierPath(roundedRect: cutoutRect, cornerRadius: 12)
        path.append(cutoutPath.reversing())
        
        let maskLayer = CAShapeLayer()
        maskLayer.path = path.cgPath
        maskLayer.fillRule = .evenOdd
        overlayView.layer.mask = maskLayer
        
        // Add border around cutout
        let borderLayer = CAShapeLayer()
        borderLayer.path = cutoutPath.cgPath
        borderLayer.fillColor = UIColor.clear.cgColor
        borderLayer.strokeColor = UIColor.white.cgColor
        borderLayer.lineWidth = 3
        overlayView.layer.addSublayer(borderLayer)
        
        view.addSubview(overlayView)
        
        // Add instruction label
        let instructionLabel = UILabel()
        instructionLabel.text = "Position the barcode within the frame"
        instructionLabel.textColor = .white
        instructionLabel.textAlignment = .center
        instructionLabel.font = .systemFont(ofSize: 16, weight: .medium)
        instructionLabel.frame = CGRect(
            x: 0,
            y: cutoutRect.maxY + 20,
            width: view.bounds.width,
            height: 30
        )
        view.addSubview(instructionLabel)
    }
    
    func startScanning() {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.captureSession?.startRunning()
        }
    }
    
    func stopScanning() {
        captureSession?.stopRunning()
    }
}

extension ScannerViewController: AVCaptureMetadataOutputObjectsDelegate {
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            delegate?.didScanBarcode(stringValue)
        }
    }
}

